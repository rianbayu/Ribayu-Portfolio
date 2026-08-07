/** Ditampilkan saat database menerima permintaan tetapi tidak mengubah
 * satu baris pun -- gejala khas penolakan RLS, yang tidak pernah muncul
 * sebagai error di supabase-js. */
export const NO_ROWS_MESSAGE =
  "Database menolak perubahan ini tanpa pesan error: tidak ada baris yang terpengaruh. Biasanya berarti sesi Anda bukan pemilik portofolio ini, atau sesi sudah kedaluwarsa. Coba keluar lalu masuk lagi.";
