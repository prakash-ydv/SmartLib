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

  const handleImageUpload = async (file) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const { uploadBookImage } = await import("../api/axios");
      const result = await uploadBookImage(file, null);

      if (result.status === "success") {
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
  // 🔥 ULTIMATE TRANSFORMATION LOGIC
  // ===============================
  const transformRawDataToBackendFormat = (rawRows) => {
    const bookMap = {};

    console.log("🔍 TRANSFORMATION START - Total rows:", rawRows.length);
    if (rawRows.length > 0) {
      console.log("🔍 Sample raw row:", rawRows[0]);
    }

    rawRows.forEach((row, index) => {
      // Skip empty rows
      if (!row.title || row.title.toString().trim() === "") {
        return;
      }

      // ✅ ULTIMATE CLEANING FUNCTION - Handles ALL edge cases
      const ultraClean = (value) => {
        // Handle null/undefined
        if (value === null || value === undefined) return "";
        
        // Convert to string
        let str = String(value).trim();
        
        // ✅ CRITICAL: Remove ALL types of quotes
        // Remove leading/trailing quotes (single, double, escaped)
        str = str.replace(/^['"`]+|['"`]+$/g, '');
        str = str.replace(/^\\["']|\\["']$/g, '');
        
        // Trim again
        str = str.trim();
        
        // ✅ Handle special escaped quotes like \"\" or \'\'
        if (str === '""' || str === "''" || str === '\\"\\"' || str === "\\'\\'" || str === '""') {
          return "";
        }
        
        // Check for garbage values
        const garbage = [
          "", "nan", "NaN", "null", "undefined", 
          "none", "None", "NONE", "N/A", "n/a", "NA", "na",
          "-", "--", "___", "...", "nil", "Nil", "NIL",
          "0", "false", "False", "FALSE"
        ];
        
        if (garbage.includes(str.toLowerCase())) return "";
        if (garbage.includes(str)) return "";
        
        return str;
      };

      // ✅ Smart field getter with case-insensitive matching
      const getField = (possibleNames) => {
        // Try exact match
        for (const name of possibleNames) {
          if (row.hasOwnProperty(name)) {
            const cleaned = ultraClean(row[name]);
            if (cleaned) return cleaned;
          }
        }

        // Try case-insensitive
        const rowKeys = Object.keys(row);
        for (const name of possibleNames) {
          const normalized = name.toLowerCase().replace(/[\s_-]/g, '');
          const matched = rowKeys.find(k => 
            k.toLowerCase().replace(/[\s_-]/g, '') === normalized
          );
          if (matched) {
            const cleaned = ultraClean(row[matched]);
            if (cleaned) return cleaned;
          }
        }

        return "";
      };

      // ✅ Extract fields
      const title = ultraClean(row.title);
      if (!title) return;

      const author = getField([
        "author", "Author", "AUTHOR",
        "auther", "Auther", 
        "writer", "Writer",
        "authors", "Authors",
        "by", "By"
      ]);

      const description = getField([
        "description", "Description",
        "desc", "Desc",
        "about", "summary"
      ]);

      const isbn = getField([
        "isbn", "ISBN",
        "isbn13", "ISBN13"
      ]);

      const publisher = getField([
        "publisher", "Publisher",
        "publication", "Publication"
      ]);

      const edition = getField([
        "edition", "Edition",
        "ed", "Ed"
      ]);

      const cover_url = getField([
        "cover_url", "coverurl",
        "image", "Image",
        "img", "cover"
      ]);

      const acc = getField([
        "acc", "Acc", "ACC",
        "accession", "Accession",
        "copy", "copies"
      ]);

      const deptValue = getField([
        "department", "Department",
        "dept", "Dept",
        "branch"
      ]);

      const department = deptValue || defaultDepartment;

      // ✅ DEBUG: Show what we extracted
      if (index < 5) {
        console.log(`📚 Row ${index + 1}:`, {
          title,
          author: author || "(empty)",
          authorRaw: row.author,
          department
        });
      }

      // Generate unique key
      const key = isbn 
        ? `isbn_${isbn}` 
        : `${title}_${author}_${edition}_${publisher}`.toLowerCase();

      // Store or merge
      if (!bookMap[key]) {
        bookMap[key] = {
          title,
          description,
          author,
          department,
          isbn,
          publisher,
          edition,
          cover_url,
          accList: [],
        };
      } else {
        // Merge non-empty values
        if (description) bookMap[key].description = description;
        if (author) bookMap[key].author = author;
        if (publisher) bookMap[key].publisher = publisher;
        if (edition) bookMap[key].edition = edition;
        if (cover_url) bookMap[key].cover_url = cover_url;
      }

      // Collect accession
      if (acc && !bookMap[key].accList.includes(acc)) {
        bookMap[key].accList.push(acc);
      }
    });

    // Finalize
    const finalBooks = Object.values(bookMap).map((book) => {
      const result = { ...book };

      // Merge accessions
      if (result.accList.length > 0) {
        result.acc = result.accList.join(";");
      } else {
        result.acc = "";
      }
      delete result.accList;

      // ✅ FINAL CHECK
      console.log(`✅ Final: "${result.title}" by "${result.author || '(no author)'}"`);

      return result;
    });

    console.log(`🎯 Created ${finalBooks.length} unique books`);
    return finalBooks;
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

    const maxSize = 5 * 1024 * 1024;
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
  // 🔥 BULK UPLOAD
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

      // ✅ Read Excel with special options
      const fileBuffer = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(fileBuffer, { 
        type: "array",
        raw: false,        // Don't use raw values
        cellText: false,   // Use formatted text
        cellDates: false,  // Don't auto-convert dates
        defval: null       // Use null for empty cells
      });
      
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // ✅ Parse to JSON without defaults
      const rawData = XLSX.utils.sheet_to_json(worksheet, { 
        raw: false,
        defval: null,      // ✅ CRITICAL: null for empty cells
        blankrows: false   // Skip blank rows
      });

      setUploadProgress(30);

      console.log("📊 Parsed", rawData.length, "rows from Excel");

      if (!rawData || rawData.length === 0) {
        throw new Error("File is empty or has no valid data");
      }

      // Track stats
      const rawDataStats = {
        totalRawRows: rawData.length,
        validRawRows: rawData.filter(
          (row) => row.title && row.title.toString().trim() !== "",
        ).length,
        emptyRows: rawData.filter(
          (row) => !row.title || row.title.toString().trim() === "",
        ).length,
      };

      // Transform
      const transformedData = transformRawDataToBackendFormat(rawData);

      setUploadProgress(50);

      if (transformedData.length === 0) {
        throw new Error("No valid books found after transformation");
      }

      // Stats
      const transformStats = {
        rawEntriesProcessed: rawDataStats.validRawRows,
        uniqueBooksCreated: transformedData.length,
        duplicatesGrouped: rawDataStats.validRawRows - transformedData.length,
      };

      // Create new Excel
      const newWorksheet = XLSX.utils.json_to_sheet(transformedData);
      const newWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Books");

      const excelBuffer = XLSX.write(newWorkbook, {
        bookType: "xlsx",
        type: "array",
      });
      
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const transformedFile = new File(
        [blob],
        `transformed_${selectedFile.name}`,
        { type: blob.type },
      );

      setUploadProgress(70);

      console.log("🚀 Uploading to backend...");
      const result = await uploadBulkBooks(transformedFile);
      console.log("✅ Backend response:", result);

      setUploadProgress(90);
      setTimeout(() => setUploadProgress(100), 200);

      const report = result.report || {};

      setUploadResult({
        success: result.status === "success",
        message: result.message || "Books uploaded successfully!",
        count: result.count || 0,
        transformStats: transformStats,
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
      console.error("❌ Upload error:", err);
      setUploadProgress(0);
      setError(err.message || "Upload failed. Please check your file format and try again.");
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
    const template = `title,author,description,department,isbn,publisher,edition,cover_url,acc
Introduction to AI,Stuart Russell,Basics of Artificial Intelligence,CSE,9780136042594,Pearson,4th,https://example.com/ai.jpg,ACC001;ACC002
Data Structures,Thomas Cormen,Advanced Data Structures,IT,9780262033848,MIT Press,3rd,https://example.com/ds.jpg,ACC003
Digital Electronics,Morris Mano,Fundamentals of Digital Design,ECE,9788120333086,PHI,5th,https://example.com/digital.jpg,ACC004;ACC005;ACC006`;

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
      {/* HEADER */}
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

      {/* ERROR ALERT */}
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

      {/* SUBMITTING STATE */}
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

      {/* SUCCESS/FAILURE REPORTS - keeping existing code */}
      {uploadResult && uploadResult.success && (
        <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl shadow-md">
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
            </div>
          )}

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
                    {uploadResult.report.errors.length} Error(s) Found
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
        </div>
      )}

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
            </div>
          </div>
        </div>
      )}

      {/* SINGLE BOOK FORM */}
      <BookForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel={isSubmitting ? "Adding Book..." : "Add Book"}
        disabled={isSubmitting || isUploading}
        onUploadImage={handleImageUpload}
      />

      {/* DIVIDER */}
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

      {/* BULK UPLOAD SECTION */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border-2 border-dashed border-blue-300 shadow-inner">
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
            <li>✅ Upload raw data (one row per physical copy)</li>
            <li>🔄 Automatically merges duplicate books</li>
            <li>📚 Combines accession numbers with semicolons</li>
            <li>📄 Supports: .xlsx, .xls, .csv (Max 5MB)</li>
            <li className="font-bold text-green-700">
              ✅ Now handles ALL quote types and empty cells!
            </li>
          </ul>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🏛️ Default Department (for missing department)
          </label>
          <select
            value={defaultDepartment}
            onChange={(e) => setDefaultDepartment(e.target.value)}
            disabled={isUploading}
            className="block w-full px-4 py-2 text-sm text-gray-900 border-2 border-gray-300 rounded-lg bg-white hover:border-blue-400 focus:border-blue-500 focus:outline-none disabled:opacity-50"
          >
            <option value="GENERAL">GENERAL</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="MECH">MECH</option>
            <option value="CIVIL">CIVIL</option>
            <option value="MBA">MBA</option>
            <option value="BCA">BCA</option>
            <option value="B.COM">B.COM</option>
            <option value="B.SC">B.SC</option>
            <option value="AGRICULTURE">AGRICULTURE</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📎 Select Excel or CSV File
          </label>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="block w-full text-sm text-gray-900 border-2 border-gray-300 rounded-lg cursor-pointer bg-white file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
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
                className="text-red-500 hover:text-red-700"
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

        {isUploading && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span className="font-medium">Processing...</span>
              <span className="font-bold">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDownloadTemplate}
            disabled={isUploading}
            className="flex-1 px-6 py-3 border-2 border-blue-500 rounded-lg text-blue-700 bg-white hover:bg-blue-50 font-semibold disabled:opacity-50 flex items-center justify-center space-x-2"
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
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 font-bold disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg"
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