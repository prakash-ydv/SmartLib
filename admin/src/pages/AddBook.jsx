import React, { useState } from "react";
import * as XLSX from "xlsx";
import BookForm from "../components/books/BookForm";
import { uploadBulkBooks } from "../api/axios";

const AddBook = ({ isOpen, onClose, onBookAdded, onBulkUploaded }) => {
  // ===============================
  // FORM STATE
  // ===============================
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    department: "",
    isbn: "",
    publisher: "",
    edition: "",
    cover_url: "",
    copies: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // ===============================
  // BULK UPLOAD STATE
  // ===============================
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);
  const [showDetailedReport, setShowDetailedReport] = useState(false);
  const [defaultDepartment, setDefaultDepartment] = useState("GENERAL");

  // ===============================
  // RESET FUNCTIONS
  // ===============================
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      author: "",
      department: "",
      isbn: "",
      publisher: "",
      edition: "",
      cover_url: "",
      copies: [],
    });
    setError(null);
    setSelectedFile(null);
    setUploadResult(null);
    setUploadProgress(0);
    setShowDetailedReport(false);
  };

  // ===============================
  // SINGLE BOOK ADD
  // ===============================
  const handleSubmit = async () => {
    if (!formData.title || !formData.department) {
      setError("Title and Department are required!");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const cleanData = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => {
          if (Array.isArray(v)) return v.length > 0;
          return v !== "" && v !== null && v !== undefined;
        }),
      );

      if (onBookAdded) {
        const result = await onBookAdded(cleanData);

        if (result && result.success) {
          alert("✅ Book added successfully!");
          resetForm();
          onClose();
        } else {
          setError(result?.error || "Failed to add book. Please try again.");
        }
      } else {
        setError("No callback provided. Contact developer.");
      }
    } catch (err) {
      setError(err.message || "Failed to add book. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * ✅ Handle Image Upload for New Book
   * Uploads image first, gets URL, and sets it in form state
   */
  const handleImageUpload = async (file) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { uploadBookImage } = await import("../api/axios");
      // Pass null as bookId since we are creating a new book
      const result = await uploadBookImage(file, null);

      if (result.status === "success") {
        // Update form data with new URL
        setFormData((prev) => ({
          ...prev,
          cover_url: result.data.url,
        }));
        alert("✅ Image uploaded successfully!");
      } else {
        throw new Error(result.message || "Upload failed");
      }
    } catch (err) {
      console.error("❌ Upload Error:", err);
      setError(err.message || "Failed to upload image.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===============================
  // 🔥 CORE TRANSFORMATION LOGIC
  // ===============================
  const transformRawDataToBackendFormat = (rawRows) => {
    const bookMap = {};

    rawRows.forEach((row) => {
      // Skip empty rows
      if (!row.title || row.title.toString().trim() === "") return;

      // Generate grouping key
      const key =
        row.isbn && row.isbn.toString().trim() !== ""
          ? `isbn_${row.isbn.toString().trim()}`
          : `${row.title.toString().trim()}_${(row.author || "").toString().trim()}_${(row.edition || "").toString().trim()}_${(row.publisher || "").toString().trim()}`;

      // Helper function to safely get field value
      const getFieldValue = (value) => {
        if (!value) return "";
        const str = value.toString().trim();
        return str === "nan" ||
          str === "NaN" ||
          str === "null" ||
          str === "undefined"
          ? ""
          : str;
      };

      // Get department - use row value if available, otherwise use selected default
      const deptValue = getFieldValue(row.department);
      const department = deptValue || defaultDepartment;

      // Initialize book entry if not exists
      if (!bookMap[key]) {
        bookMap[key] = {
          title: row.title.toString().trim(),
          description: getFieldValue(row.description),
          author: getFieldValue(row.author),
          department: department,
          isbn: getFieldValue(row.isbn),
          publisher: getFieldValue(row.publisher),
          edition: getFieldValue(row.edition),
          cover_url: getFieldValue(row.cover_url),
          accList: [],
        };
      }

      // Collect accession number
      const accValue = getFieldValue(row.acc);
      if (accValue && !bookMap[key].accList.includes(accValue)) {
        bookMap[key].accList.push(accValue);
      }
    });

    // Convert to array and merge accession numbers
    return Object.values(bookMap).map((book) => {
      const merged = { ...book };

      // Merge accession numbers with semicolon
      if (merged.accList.length > 0) {
        merged.acc = merged.accList.join(";");
      } else {
        merged.acc = "";
      }

      // Remove temporary accList
      delete merged.accList;

      return merged;
    });
  };

  // ===============================
  // FILE HANDLING
  // ===============================
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];

    if (
      !allowedTypes.includes(file.type) &&
      !file.name.endsWith(".xlsx") &&
      !file.name.endsWith(".xls") &&
      !file.name.endsWith(".csv")
    ) {
      setError(
        "❌ Invalid file type. Please upload Excel (.xlsx, .xls) or CSV file.",
      );
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError("❌ File too large. Maximum size is 5MB.");
      return;
    }

    setSelectedFile(file);
    setError(null);
    setUploadResult(null);
    setUploadProgress(0);
  };

  // ===============================
  // 🔥 BULK UPLOAD WITH TRANSFORMATION
  // ===============================
  const handleBulkUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadResult(null);
    setUploadProgress(0);

    try {
      setUploadProgress(10);

      // Read the file
      const fileBuffer = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(fileBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Parse to JSON
      const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      setUploadProgress(30);

      if (!rawData || rawData.length === 0) {
        throw new Error("File is empty or has no valid data");
      }

      // 📊 TRACK RAW DATA STATS
      const rawDataStats = {
        totalRawRows: rawData.length,
        validRawRows: rawData.filter(
          (row) => row.title && row.title.toString().trim() !== "",
        ).length,
        emptyRows: rawData.filter(
          (row) => !row.title || row.title.toString().trim() === "",
        ).length,
      };

      // Transform data
      const transformedData = transformRawDataToBackendFormat(rawData);

      setUploadProgress(50);

      if (transformedData.length === 0) {
        throw new Error("No valid books found after transformation");
      }

      // 📊 TRANSFORMATION STATS
      const transformStats = {
        rawEntriesProcessed: rawDataStats.validRawRows,
        uniqueBooksCreated: transformedData.length,
        duplicatesGrouped: rawDataStats.validRawRows - transformedData.length,
      };

      // Create new Excel file with transformed data
      const newWorksheet = XLSX.utils.json_to_sheet(transformedData);
      const newWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Books");

      // Convert to blob
      const excelBuffer = XLSX.write(newWorkbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create File object
      const transformedFile = new File(
        [blob],
        `transformed_${selectedFile.name}`,
        { type: blob.type },
      );

      setUploadProgress(70);

      // Upload transformed file
      const result = await uploadBulkBooks(transformedFile);

      setUploadProgress(90);
      setTimeout(() => setUploadProgress(100), 200);

      const report = result.report || {};

      setUploadResult({
        success: result.status === "success",
        message: result.message || "Books uploaded successfully!",
        count: result.count || 0,
        transformStats: transformStats, // 📊 ADD TRANSFORMATION STATS
        report: {
          totalRows: report.totalRows || 0,
          validRows: report.validRows || 0,
          inserted: report.inserted || 0,
          updated: report.updated || 0,
          skipped: report.skipped || 0,
          errors: report.errors || [],
        },
      });

      if (result.status === "success") {
        setTimeout(() => {
          setSelectedFile(null);
          setUploadProgress(0);
        }, 3000);
      }

      if (typeof onBulkUploaded === "function") {
        await onBulkUploaded(report);
      }
    } catch (err) {
      setUploadProgress(0);
      setError(
        err.message ||
          "Upload failed. Please check your file format and try again.",
      );
      setUploadResult({
        success: false,
        message: err.message,
        report: {
          errors: [err.message],
        },
      });
    } finally {
      setIsUploading(false);
    }
  };

  // ===============================
  // DOWNLOAD TEMPLATE
  // ===============================
  const handleDownloadTemplate = () => {
    const template = `title,description,author,department,isbn,publisher,edition,cover_url,acc
Introduction to AI,Basics of Artificial Intelligence,Stuart Russell,CSE,9780136042594,Pearson,4th,https://example.com/ai.jpg,ACC001;ACC002
Data Structures,Advanced Data Structures,Thomas Cormen,IT,9780262033848,MIT Press,3rd,https://example.com/ds.jpg,ACC003
Digital Electronics,Fundamentals of Digital Design,Morris Mano,ECE,9788120333086,PHI,5th,https://example.com/digital.jpg,ACC004;ACC005;ACC006`;

    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `library_upload_template_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ===============================
  // DOWNLOAD ERROR REPORT
  // ===============================
  const handleDownloadErrorReport = () => {
    if (!uploadResult || !uploadResult.report || !uploadResult.report.errors)
      return;

    const errorReport = `Upload Error Report - ${new Date().toLocaleString()}
    
Total Rows: ${uploadResult.report.totalRows}
Valid Rows: ${uploadResult.report.validRows}
Inserted: ${uploadResult.report.inserted}
Updated: ${uploadResult.report.updated}
Skipped: ${uploadResult.report.skipped}

ERRORS:
${uploadResult.report.errors.map((err, i) => `${i + 1}. ${err}`).join("\n")}`;

    const blob = new Blob([errorReport], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `upload_errors_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ===============================
  // CANCEL HANDLER
  // ===============================
  const handleCancel = () => {
    if (isSubmitting || isUploading) return;

    const hasData =
      Object.values(formData).some((v) =>
        Array.isArray(v) ? v.length > 0 : v !== "",
      ) || selectedFile !== null;

    if (hasData) {
      if (!window.confirm("⚠️ Are you sure? All entered data will be lost.")) {
        return;
      }
    }

    resetForm();
    onClose();
  };

  // ===============================
  // RENDER
  // ===============================
  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 mt-10 border-2 border-blue-500">
      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Add New Book</h2>
        </div>

        <button
          onClick={handleCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting || isUploading}
          title="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* ========================================= */}
      {/* ERROR ALERT */}
      {/* ========================================= */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-red-500 mt-0.5 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-semibold text-red-800">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* SUBMITTING STATE */}
      {/* ========================================= */}
      {isSubmitting && (
        <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
            <p className="text-blue-800 font-medium">
              Adding book to library...
            </p>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* UPLOAD SUCCESS REPORT */}
      {/* ========================================= */}
      {uploadResult && uploadResult.success && (
        <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl shadow-md">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-800">
                  Upload Successful! 🎉
                </h3>
                <p className="text-sm text-green-600">{uploadResult.message}</p>
              </div>
            </div>
          </div>

          {/* 📊 RAW DATA PROCESSING STATS */}
          {uploadResult.transformStats && (
            <div className="mb-4 bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
              <h4 className="text-sm font-bold text-blue-800 mb-2">
                📊 Data Processing Summary
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">📥</span>
                  <div>
                    <p className="text-blue-600 font-semibold">Raw Entries</p>
                    <p className="text-xl font-bold text-blue-900">
                      {uploadResult.transformStats.rawEntriesProcessed}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🔄</span>
                  <div>
                    <p className="text-orange-600 font-semibold">
                      Grouped Duplicates
                    </p>
                    <p className="text-xl font-bold text-orange-900">
                      {uploadResult.transformStats.duplicatesGrouped}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">📚</span>
                  <div>
                    <p className="text-green-600 font-semibold">Unique Books</p>
                    <p className="text-xl font-bold text-green-900">
                      {uploadResult.transformStats.uniqueBooksCreated}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-3 p-2 bg-white rounded border border-blue-200">
                <p className="text-xs text-blue-700">
                  <strong>
                    ✅ {uploadResult.transformStats.rawEntriesProcessed}{" "}
                    physical copies
                  </strong>{" "}
                  from your file were grouped into{" "}
                  <strong>
                    {uploadResult.transformStats.uniqueBooksCreated} unique
                    books
                  </strong>{" "}
                  with merged accession numbers
                </p>
              </div>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold">
                Books Processed
              </p>
              <p className="text-2xl font-bold text-gray-800">
                {uploadResult.report.totalRows}
              </p>
            </div>
            <div className="bg-green-100 rounded-lg p-4 shadow-sm">
              <p className="text-xs text-green-700 uppercase font-semibold">
                ✅ Inserted
              </p>
              <p className="text-2xl font-bold text-green-800">
                {uploadResult.report.inserted}
              </p>
            </div>
            <div className="bg-blue-100 rounded-lg p-4 shadow-sm">
              <p className="text-xs text-blue-700 uppercase font-semibold">
                🔄 Updated
              </p>
              <p className="text-2xl font-bold text-blue-800">
                {uploadResult.report.updated}
              </p>
            </div>
            <div className="bg-yellow-100 rounded-lg p-4 shadow-sm">
              <p className="text-xs text-yellow-700 uppercase font-semibold">
                ⚠️ Skipped
              </p>
              <p className="text-2xl font-bold text-yellow-800">
                {uploadResult.report.skipped}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Upload Progress</span>
              <span>
                {uploadResult.report.validRows} /{" "}
                {uploadResult.report.totalRows} valid rows
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${(uploadResult.report.validRows / uploadResult.report.totalRows) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Error Details Toggle */}
          {uploadResult.report.errors &&
            uploadResult.report.errors.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={() => setShowDetailedReport(!showDetailedReport)}
                  className="flex items-center space-x-2 text-sm text-red-700 hover:text-red-800 font-medium"
                >
                  <svg
                    className={`w-4 h-4 transition-transform ${showDetailedReport ? "rotate-90" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  <span>
                    {uploadResult.report.errors.length} Error(s) Found - Click
                    to View
                  </span>
                </button>

                {showDetailedReport && (
                  <div className="mt-3 bg-red-50 rounded-lg p-4 border border-red-200 max-h-60 overflow-y-auto">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-red-800">
                        Error Details:
                      </h4>
                      <button
                        onClick={handleDownloadErrorReport}
                        className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        📥 Download Report
                      </button>
                    </div>
                    <ul className="space-y-1 text-sm text-red-700">
                      {uploadResult.report.errors.map((err, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-500 mr-2">•</span>
                          <span>{err}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

          {/* Success Message */}
          {uploadResult.report.errors.length === 0 && (
            <div className="mt-4 flex items-center space-x-2 text-green-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="font-medium">
                All books uploaded successfully with no errors!
              </p>
            </div>
          )}
        </div>
      )}

      {/* ========================================= */}
      {/* UPLOAD FAILED REPORT */}
      {/* ========================================= */}
      {uploadResult && !uploadResult.success && (
        <div className="mb-6 p-6 bg-red-50 border-2 border-red-300 rounded-xl">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-800 mb-2">
                Upload Failed
              </h3>
              <p className="text-sm text-red-700 mb-3">
                {uploadResult.message}
              </p>

              {uploadResult.report?.errors &&
                uploadResult.report.errors.length > 0 && (
                  <div className="bg-white rounded-lg p-3 border border-red-200">
                    <p className="text-xs font-semibold text-red-800 mb-2">
                      Errors:
                    </p>
                    <ul className="space-y-1 text-xs text-red-700">
                      {uploadResult.report.errors.map((err, index) => (
                        <li key={index}>• {err}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* SINGLE BOOK FORM */}
      {/* ========================================= */}
      <BookForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel={isSubmitting ? "Adding Book..." : "Add Book"}
        disabled={isSubmitting || isUploading}
        onUploadImage={handleImageUpload}
      />

      {/* ========================================= */}
      {/* DIVIDER */}
      {/* ========================================= */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 bg-white text-gray-500 font-bold text-lg">
            OR UPLOAD BULK
          </span>
        </div>
      </div>

      {/* ========================================= */}
      {/* BULK UPLOAD SECTION */}
      {/* ========================================= */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border-2 border-dashed border-blue-300 shadow-inner">
        {/* Instructions */}
        <div className="mb-6 bg-blue-100 rounded-lg p-4 border-l-4 border-blue-500">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            Upload Instructions
          </h4>
          <ul className="text-sm text-blue-800 space-y-1 ml-7">
            <li>
              ✅ Upload your college's raw data (one row per physical copy)
            </li>
            <li>🔄 System will automatically merge duplicate books</li>
            <li>📚 Accession numbers will be combined with semicolons</li>
            <li>
              🏛️ If department is missing in file, selected department will be
              used
            </li>
            <li>📄 Supported formats: .xlsx, .xls, .csv (Max 5MB)</li>
          </ul>
        </div>

        {/* Department Selector */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🏛️ Default Department (for books without department in file)
          </label>
          <select
            value={defaultDepartment}
            onChange={(e) => setDefaultDepartment(e.target.value)}
            disabled={isUploading}
            className="block w-full px-4 py-2 text-sm text-gray-900 border-2 border-gray-300 rounded-lg bg-white hover:border-blue-400 focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="GENERAL">GENERAL</option>
            <option value="CSE">CSE (Computer Science)</option>
            <option value="IT">IT (Information Technology)</option>
            <option value="ECE">ECE (Electronics)</option>
            <option value="EEE">EEE (Electrical)</option>
            <option value="MECH">MECH (Mechanical)</option>
            <option value="CIVIL">CIVIL</option>
            <option value="MBA">MBA</option>
            <option value="MCA">MCA</option>
            <option value="BBA">BBA</option>
            <option value="BCA">BCA</option>
            <option value="B.COM">B.COM</option>
            <option value="B.SC">B.SC</option>
            <option value="B.PHARM">B.PHARM</option>
            <option value="B.ARCH">B.ARCH</option>
            <option value="AGRICULTURE">AGRICULTURE</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            💡 This will be used only for books that don't have a department in
            the Excel file
          </p>
        </div>

        {/* File Input */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📎 Select Excel or CSV File
          </label>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="block w-full text-sm text-gray-900 border-2 border-gray-300 rounded-lg cursor-pointer bg-white hover:border-blue-400 focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
          />
          {selectedFile && (
            <div className="mt-3 flex items-center justify-between bg-white rounded-lg p-3 border border-green-300">
              <div className="flex items-center space-x-3">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setUploadResult(null);
                  setUploadProgress(0);
                }}
                disabled={isUploading}
                className="text-red-500 hover:text-red-700 disabled:opacity-50"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {isUploading && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span className="font-medium">Processing and uploading...</span>
              <span className="font-bold">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 flex items-center justify-center text-xs text-white font-semibold transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              >
                {uploadProgress > 10 && `${uploadProgress}%`}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              Transforming data and uploading...
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleDownloadTemplate}
            disabled={isUploading}
            className="flex-1 w-full sm:w-auto px-6 py-3 border-2 border-blue-500 rounded-lg text-blue-700 bg-white hover:bg-blue-50 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Download Template</span>
          </button>

          <button
            onClick={handleBulkUpload}
            disabled={!selectedFile || isUploading}
            className="flex-1 w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg transition-all transform hover:scale-105"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span>Upload Books</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBook;
