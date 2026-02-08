import mongoose from 'mongoose';

/**
 * ✅ SAFE ISBN Index Fix
 * - Only runs if needed
 * - Won't break existing data
 * - Won't affect connection
 */
export async function fixISBNIndex() {
    try {
        const db = mongoose.connection.db;
        
        if (!db) {
            console.log('⚠️ Database not connected, skipping index fix');
            return;
        }

        const collection = db.collection('books');
        
        // ✅ SAFETY CHECK: Get all existing indexes
        const indexes = await collection.indexes();
        console.log('📋 Current indexes:', indexes.map(i => i.name).join(', '));
        
        // ✅ Check if old non-sparse index exists
        const oldIsbnIndex = indexes.find(idx => 
            idx.name === 'isbn_1'
        );

        if (!oldIsbnIndex) {
            console.log('✅ ISBN index not found, will create on first insert');
            return;
        }

        // ✅ Check if already has sparse property
        if (oldIsbnIndex.sparse === true) {
            console.log('✅ ISBN index already correct (sparse: true)');
            return;
        }

        // ✅ SAFE: Drop and recreate only if needed
        console.log('🔧 Fixing ISBN index (adding sparse property)...');
        
        await collection.dropIndex('isbn_1');
        console.log('✅ Old index dropped');
        
        await collection.createIndex(
            { isbn: 1 }, 
            { unique: true, sparse: true, name: 'isbn_1' }
        );
        console.log('✅ New sparse index created');
        console.log('🎉 Index fix complete - CSV upload ready!');
        
    } catch (error) {
        // ⚠️ Don't throw - just log
        console.log('⚠️ Index fix error (app will continue):', error.message);
    }
}