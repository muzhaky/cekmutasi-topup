# Finote - Catatan Keuangan Modern

Aplikasi catatan keuangan responsif yang dibangun dengan Next.js 14, shadcn/ui, dan Prisma. Desain serta pengalaman pengguna terinspirasi dari estetika Laravel Filament untuk menghadirkan dasbor finansial yang rapi, intuitif, dan nyaman digunakan.

## Fitur utama

- 📊 **Ringkasan finansial** dengan kartu metrik interaktif (saldo, pemasukan, pengeluaran, transfer).
- 🧾 **Manajemen transaksi lengkap**: tambah, ubah, dan hapus pemasukan/pengeluaran/transfer.
- 🗂️ **Kategori & catatan** untuk setiap transaksi sehingga pencatatan lebih kontekstual.
- ☁️ **Tema gelap & terang** menggunakan `next-themes`.
- ⚡ **API berbasis Next.js** yang terhubung ke database MySQL atau SQLite melalui Prisma.
- 🎨 **Komponen shadcn/ui** yang dikustomisasi sehingga tampil elegan ala Filament.

## Persyaratan

- Node.js 18 atau yang lebih baru
- npm / pnpm / yarn
- Database:
  - **SQLite** (default, tanpa konfigurasi tambahan), atau
  - **MySQL/MariaDB** jika ingin di-deploy secara terpusat

## Konfigurasi lingkungan

Salin berkas contoh environment lalu sesuaikan jika diperlukan.

```bash
cp .env.example .env
```

Secara bawaan aplikasi memakai SQLite. Untuk menggunakan MySQL, ubah nilai berikut pada `.env`:

```env
DATABASE_PROVIDER="mysql"
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
```

> 💡 Prisma akan otomatis menyesuaikan tipe kolom ketika Anda menjalankan migrasi.

## Instalasi & menjalankan aplikasi

1. **Instal dependensi**

   ```bash
   npm install
   ```

2. **Generate Prisma Client serta push skema database**

   ```bash
   npx prisma db push
   ```

3. **Jalankan server pengembangan**

   ```bash
   npm run dev
   ```

4. Buka `http://localhost:3000` untuk melihat dasbor.

## Struktur proyek singkat

```
app/
  page.tsx                -> Halaman utama dasbor
  api/transactions/       -> Endpoint RESTful untuk transaksi
components/
  transaction-form.tsx    -> Form tambah/ubah transaksi
  transaction-table.tsx   -> Tabel daftar transaksi
  summary-cards.tsx       -> Kartu ringkasan metrik finansial
lib/
  prisma.ts               -> Inisialisasi Prisma Client
  validations.ts          -> Skema validasi dengan Zod
prisma/
  schema.prisma           -> Definisi skema database
```

## Script npm

| Perintah           | Deskripsi                                   |
| ------------------ | ------------------------------------------- |
| `npm run dev`      | Menjalankan server pengembangan Next.js      |
| `npm run build`    | Build aplikasi untuk produksi               |
| `npm run start`    | Menjalankan build produksi                  |
| `npm run lint`     | Menjalankan lint bawaan Next.js             |

## Lisensi

Proyek ini mengikuti lisensi MIT sebagaimana tercantum pada berkas `LICENSE`.
