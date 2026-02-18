// Definisikan nama file di paling atas agar bisa diakses semua fungsi
const FILE_NAME = "notes.txt"
const newNote = "This is a new note.happy coding!\n";

//1 fungsi untuk menulis catatan ke dalam file
async function addNote(content: string) {
try {
    const file = Bun.file(FILE_NAME);
    
    // Ambil isi lama jika ada
    const existingContent = await file.exists() ? await file.text() : "";
    
    // Tambahkan catatan baru (dengan timestamp agar lebih keren)
    const getTimestamp = () => {
  return new Date().toISOString().replace("T", " ").split(".")[0];
};
    const timestamp = getTimestamp();
    const formattedNote = `[${timestamp}] ${content}\n`;
    
    // Simpan kembali
    await Bun.write(FILE_NAME, existingContent + formattedNote);
    
    console.log("✅ Catatan berhasil disimpan!");
  } catch (error) {
    console.error("❌ Gagal menyimpan catatan:", error);
  }
}

// 2. Fungsi untuk membaca semua catatan
async function readNotes() {
const file = Bun.file(FILE_NAME);
  if (await file.exists()) {
    const content = await file.text();
    console.log("\n--- DAFTAR CATATAN ---");
    // Menampilkan nomor baris agar mudah untuk dihapus nanti
    const lines = content.trim().split("\n");
    lines.forEach((line, index) => {
      console.log(`${index + 1}. ${line}`);
    });
  } else {
    console.log("\n📭 Belum ada catatan tersimpan.");
  }
}

// 3. Fungsi untuk menghapus catatan berdasarkan nomor baris
async function deleteNote(lineNumber: number) {
  try {
    const file = Bun.file(FILE_NAME);
    if (!(await file.exists())) return;

    const content = await file.text();
    const lines = content.trim().split("\n");

    if (lineNumber > 0 && lineNumber <= lines.length) {
      const removed = lines.splice(lineNumber - 1, 1);
      // Simpan kembali sisa barisnya, jangan lupa tambahkan newline di akhir
      await Bun.write(FILE_NAME, lines.join("\n") + (lines.length > 0 ? "\n" : ""));
      console.log(`🗑️ Berhasil menghapus: ${removed}`);
    } else {
      console.log("❌ Nomor catatan tidak valid!");
    }
  } catch (error) {
    console.error("❌ Gagal menghapus catatan:", error);
  }
}

// Ambil input dari terminal: bun run index.ts "isi catatan"
const command = Bun.argv[2]; 
const value = Bun.argv[3];

async function searchNotes(keyword: string) {
  const file = Bun.file(FILE_NAME);
  if (!(await file.exists())) return;

  const content = await file.text();
  const lines = content.trim().split("\n");

  // Cari baris yang mengandung kata kunci (keyword)
  const results = lines.filter(line => 
    line.toLowerCase().includes(keyword.toLowerCase())
  );

  console.log(`\n--- Hasil Pencarian: "${keyword}" ---`);
  results.forEach(res => console.log(res));
}

if (command === "delete") {
  if (value) {
    const indexToDelete = parseInt(value);
    if (!isNaN(indexToDelete)) {
      await deleteNote(indexToDelete);
    } else {
      console.log("❌ Error: Harap masukkan angka.");
    }
  } else {
    console.log("⚠️ Masukkan nomor baris. Contoh: bun run index.ts delete 1");
  }
} 
else if (command === "search") {
  if (value) {
    await searchNotes(value); 
  } else {
    console.log("⚠️ Masukkan kata kunci pencarian!");
  }
}
else if (command === "list" || command === "view") {
  await readNotes();
} 
else if (command) {
 
  await addNote(command);
  await readNotes(); 
} 
else {
  console.log("💡 Tips:");
  console.log("   Lihat Semua : bun run index.ts list");
  console.log("   Tambah      : bun run index.ts \"isi catatan\"");
  console.log("   Hapus       : bun run index.ts delete [nomor]");
  console.log("   Cari        : bun run index.ts search [kata kunci]");
}