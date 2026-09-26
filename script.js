/* =====================================================
   DATA SISWA
===================================================== */

const siswa = [
    {
        nama: "Andi",
        kelas: "X",
        password: "andi123"
    },

    {
        nama: "Budi",
        kelas: "X",
        password: "budi123"
    },

    {
        nama: "Citra",
        kelas: "XI",
        password: "citra123"
    },

    {
        nama: "Dina",
        kelas: "XI",
        password: "dina123"
    },

    {
        nama: "Eko",
        kelas: "XII",
        password: "eko123"
    }
];


/* =====================================================
   PASSWORD ADMIN
===================================================== */

const ADMIN_PASSWORD = "ADMIN123";


/* =====================================================
   SOAL
===================================================== */

const soal = [

    {
        pertanyaan:
            "Perangkat yang digunakan untuk memasukkan data ke komputer adalah...",

        pilihan: [
            "Keyboard",
            "Monitor",
            "Printer",
            "Speaker"
        ],

        jawaban: [
            "Keyboard"
        ],

        tipe: "single"
    },


    {
        pertanyaan:
            "Manakah yang termasuk perangkat output?",

        pilihan: [
            "Monitor",
            "Keyboard",
            "Printer",
            "Mouse"
        ],

        jawaban: [
            "Monitor",
            "Printer"
        ],

        tipe: "multiple"
    },


    {
        pertanyaan:
            "Apa fungsi utama sistem operasi?",

        pilihan: [
            "Mengatur perangkat keras dan perangkat lunak",
            "Mencetak kertas",
            "Membuat kabel jaringan",
            "Membersihkan layar"
        ],

        jawaban: [
            "Mengatur perangkat keras dan perangkat lunak"
        ],

        tipe: "single"
    },


    {
        pertanyaan:
            "Manakah yang termasuk media penyimpanan?",

        pilihan: [
            "Flashdisk",
            "Keyboard",
            "Monitor",
            "Speaker"
        ],

        jawaban: [
            "Flashdisk"
        ],

        tipe: "single"
    },


    {
        pertanyaan:
            "Password yang aman sebaiknya...",

        pilihan: [
            "Menggunakan tanggal lahir",
            "Menggunakan kombinasi huruf, angka, dan simbol",
            "Menggunakan nama sendiri",
            "Menggunakan kata 123456"
        ],

        jawaban: [
            "Menggunakan kombinasi huruf, angka, dan simbol"
        ],

        tipe: "single"
    }

];


/* =====================================================
   VARIABEL
===================================================== */

let siswaAktif = null;

let ujianAktif = false;

let ujianTerkunci = false;

let ujianSelesai = false;

let waktu = 30 * 60;

let timer = null;


/* =====================================================
   ELEMEN HTML
===================================================== */

const loginPage =
    document.getElementById("loginPage");

const examPage =
    document.getElementById("examPage");

const lockPage =
    document.getElementById("lockPage");

const finishPage =
    document.getElementById("finishPage");

const namaInput =
    document.getElementById("nama");

const kelasInput =
    document.getElementById("kelas");

const passwordInput =
    document.getElementById("password");

const loginButton =
    document.getElementById("loginButton");

const adminPasswordInput =
    document.getElementById("adminPassword");

const adminButton =
    document.getElementById("adminButton");

const submitButton =
    document.getElementById("submitButton");


/* =====================================================
   KEY STATUS LOCK
===================================================== */

function getLockKey(dataSiswa) {

    return (
        "UJIAN_LOCK_" +
        dataSiswa.kelas +
        "_" +
        dataSiswa.nama
            .toLowerCase()
            .replace(/\s+/g, "_")
    );

}


/* =====================================================
   KEY IDENTITAS SISWA AKTIF
===================================================== */

const ACTIVE_STUDENT_KEY =
    "UJIAN_ACTIVE_STUDENT";


/* =====================================================
   SIMPAN IDENTITAS SISWA
   HANYA NAMA DAN KELAS
   PASSWORD TIDAK DISIMPAN
===================================================== */

function simpanIdentitasSiswa(dataSiswa) {

    const data = {
        nama: dataSiswa.nama,
        kelas: dataSiswa.kelas
    };

    localStorage.setItem(
        ACTIVE_STUDENT_KEY,
        JSON.stringify(data)
    );

}


/* =====================================================
   AMBIL IDENTITAS SISWA
===================================================== */

function ambilIdentitasSiswa() {

    const data =
        localStorage.getItem(
            ACTIVE_STUDENT_KEY
        );

    if (!data) {
        return null;
    }

    try {

        return JSON.parse(data);

    } catch (error) {

        return null;

    }

}


/* =====================================================
   CARI DATA SISWA
===================================================== */

function cariSiswa(nama, kelas) {

    return siswa.find(function(item) {

        return (
            item.nama.toLowerCase() ===
            nama.toLowerCase() &&

            item.kelas === kelas
        );

    });

}


/* =====================================================
   LOGIN SISWA
===================================================== */

function login() {

    const nama =
        namaInput.value.trim();

    const kelas =
        kelasInput.value;

    const password =
        passwordInput.value;


    const message =
        document.getElementById(
            "loginMessage"
        );


    message.textContent = "";


    /* Validasi */

    if (
        nama === "" ||
        kelas === "" ||
        password === ""
    ) {

        message.textContent =
            "Nama, kelas, dan password wajib diisi.";

        message.style.color = "red";

        return;
    }


    /* Cari siswa */

    const ditemukan =
        cariSiswa(nama, kelas);


    /* Siswa tidak terdaftar */

    if (!ditemukan) {

        message.textContent =
            "Siswa tidak terdaftar.";

        message.style.color = "red";

        passwordInput.value = "";

        return;
    }


    /* =================================================
       CEK STATUS TERKUNCI
    ================================================= */

    const statusLock =
        localStorage.getItem(
            getLockKey(ditemukan)
        );


    if (statusLock === "true") {

        message.textContent =
            "Siswa ini sudah terkunci. Password siswa tidak dapat digunakan. Gunakan password admin.";

        message.style.color = "red";

        passwordInput.value = "";

        return;
    }


    /* =================================================
       CEK PASSWORD SISWA
    ================================================= */

    if (
        password !== ditemukan.password
    ) {

        message.textContent =
            "Password siswa salah.";

        message.style.color = "red";

        passwordInput.value = "";

        return;
    }


    /* =================================================
       LOGIN BERHASIL
    ================================================= */

    siswaAktif = ditemukan;

    ujianAktif = true;

    ujianTerkunci = false;

    ujianSelesai = false;


    /*
       Simpan identitas saja.
       PASSWORD TIDAK DISIMPAN.
    */

    simpanIdentitasSiswa(
        ditemukan
    );


    /*
       Kosongkan password
    */

    passwordInput.value = "";


    mulaiUjian();

}


/* =====================================================
   MULAI UJIAN
===================================================== */

function mulaiUjian() {

    loginPage.classList.add(
        "hidden"
    );

    lockPage.classList.add(
        "hidden"
    );

    finishPage.classList.add(
        "hidden"
    );

    examPage.classList.remove(
        "hidden"
    );


    document.getElementById(
        "studentInfo"
    ).textContent =

        siswaAktif.nama +
        " | Kelas " +
        siswaAktif.kelas;


    tampilkanSoal();

    mulaiTimer();

}


/* =====================================================
   TAMPILKAN SOAL
===================================================== */

function tampilkanSoal() {

    const container =
        document.getElementById(
            "questions"
        );


    container.innerHTML = "";


    soal.forEach(
        function(item, nomor) {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "question";


            const judul =
                document.createElement(
                    "h3"
                );

            judul.textContent =
                (nomor + 1) +
                ". " +
                item.pertanyaan;


            div.appendChild(judul);


            item.pilihan.forEach(
                function(pilihan) {

                    const label =
                        document.createElement(
                            "label"
                        );

                    label.className =
                        "option";


                    const input =
                        document.createElement(
                            "input"
                        );


                    if (
                        item.tipe ===
                        "multiple"
                    ) {

                        input.type =
                            "checkbox";

                    } else {

                        input.type =
                            "radio";

                    }


                    input.name =
                        "soal_" + nomor;

                    input.value =
                        pilihan;


                    label.appendChild(
                        input
                    );


                    label.appendChild(
                        document.createTextNode(
                            " " + pilihan
                        )
                    );


                    div.appendChild(
                        label
                    );

                }
            );


            container.appendChild(
                div
            );

        }
    );

}


/* =====================================================
   TIMER
===================================================== */

function mulaiTimer() {

    clearInterval(timer);


    waktu = 30 * 60;


    updateTimer();


    timer =
        setInterval(
            function() {

                waktu--;

                updateTimer();


                if (
                    waktu <= 0
                ) {

                    clearInterval(
                        timer
                    );

                    kumpulkanUjian();

                }

            },
            1000
        );

}


/* =====================================================
   UPDATE TIMER
===================================================== */

function updateTimer() {

    const menit =
        Math.floor(
            waktu / 60
        );

    const detik =
        waktu % 60;


    document.getElementById(
        "timer"
    ).textContent =

        String(menit)
            .padStart(2, "0") +

        ":" +

        String(detik)
            .padStart(2, "0");

}


/* =====================================================
   DETEKSI PINDAH TAB
===================================================== */

document.addEventListener(
    "visibilitychange",
    function() {

        if (
            document.visibilityState ===
            "hidden" &&

            ujianAktif === true &&

            ujianSelesai === false &&

            ujianTerkunci === false
        ) {

            kunciUjian(
                "Pindah tab atau halaman ujian ditinggalkan."
            );

        }

    }
);


/* =====================================================
   DETEKSI WINDOW KEHILANGAN FOKUS
===================================================== */

window.addEventListener(
    "blur",
    function() {

        if (
            ujianAktif === true &&

            ujianSelesai === false &&

            ujianTerkunci === false
        ) {

            kunciUjian(
                "Halaman ujian kehilangan fokus."
            );

        }

    }
);


/* =====================================================
   KUNCI UJIAN
===================================================== */

function kunciUjian(alasan) {

    if (
        ujianTerkunci === true ||
        ujianSelesai === true ||
        siswaAktif === null
    ) {

        return;
    }


    ujianTerkunci = true;

    ujianAktif = false;


    clearInterval(timer);


    /*
       SIMPAN STATUS LOCK
    */

    localStorage.setItem(
        getLockKey(siswaAktif),
        "true"
    );


    /*
       IDENTITAS SISWA TETAP DISIMPAN.
       PASSWORD TIDAK DISIMPAN.
    */

    simpanIdentitasSiswa(
        siswaAktif
    );


    examPage.classList.add(
        "hidden"
    );

    lockPage.classList.remove(
        "hidden"
    );


    document.getElementById(
        "lockReason"
    ).textContent =
        alasan;


    adminPasswordInput.value = "";

}


/* =====================================================
   BUKA DENGAN PASSWORD ADMIN
===================================================== */

function bukaDenganAdmin() {

    const password =
        adminPasswordInput.value;


    const message =
        document.getElementById(
            "adminMessage"
        );


    message.textContent = "";


    /*
       JANGAN GUNAKAN PASSWORD SISWA
    */

    if (
        password !==
        ADMIN_PASSWORD
    ) {

        message.textContent =
            "Password admin salah.";

        message.style.color =
            "red";

        adminPasswordInput.value =
            "";

        return;
    }


    /*
       Pastikan siswa aktif ada.
    */

    if (
        siswaAktif === null
    ) {

        const identitas =
            ambilIdentitasSiswa();


        if (
            identitas !== null
        ) {

            siswaAktif =
                cariSiswa(
                    identitas.nama,
                    identitas.kelas
                );

        }

    }


    /*
       Jika siswa tidak ditemukan
    */

    if (
        siswaAktif === null
    ) {

        message.textContent =
            "Data siswa tidak ditemukan.";

        message.style.color =
            "red";

        adminPasswordInput.value =
            "";

        return;
    }


    /*
       PASSWORD ADMIN BENAR
       HAPUS STATUS LOCK
    */

    localStorage.removeItem(
        getLockKey(
            siswaAktif
        )
    );


    /*
       Password admin langsung
       dikosongkan.
    */

    adminPasswordInput.value =
        "";


    message.textContent =
        "Password admin benar. Ujian dibuka.";

    message.style.color =
        "green";


    /*
       Tunggu sebentar kemudian
       buka ujian.
    */

    setTimeout(
        function() {

            ujianTerkunci = false;

            ujianAktif = true;

            ujianSelesai = false;


            lockPage.classList.add(
                "hidden"
            );

            examPage.classList.remove(
                "hidden"
            );


            document.getElementById(
                "studentInfo"
            ).textContent =

                siswaAktif.nama +
                " | Kelas " +
                siswaAktif.kelas;


            mulaiTimer();

        },
        700
    );

}


/* =====================================================
   KUMPULKAN UJIAN
===================================================== */

function kumpulkanUjian() {

    if (
        ujianSelesai === true
    ) {

        return;
    }


    ujianSelesai = true;

    ujianAktif = false;


    clearInterval(timer);


    let jumlahBenar = 0;


    soal.forEach(
        function(item, nomor) {

            const pilihan =
                document.querySelectorAll(
                    'input[name="soal_' +
                    nomor +
                    '"]:checked'
                );


            const jawabanSiswa =
                [];


            pilihan.forEach(
                function(input) {

                    jawabanSiswa.push(
                        input.value
                    );

                }
            );


            jawabanSiswa.sort();


            const jawabanBenar =
                item.jawaban
                    .slice()
                    .sort();


            if (
                JSON.stringify(
                    jawabanSiswa
                ) ===

                JSON.stringify(
                    jawabanBenar
                )
            ) {

                jumlahBenar++;

            }

        }
    );


    const nilai =
        Math.round(
            (
                jumlahBenar /
                soal.length
            ) * 100
        );


    examPage.classList.add(
        "hidden"
    );

    lockPage.classList.add(
        "hidden"
    );

    finishPage.classList.remove(
        "hidden"
    );


    document.getElementById(
        "result"
    ).textContent =

        "Ujian telah selesai. Nilai: " +
        nilai;

}


/* =====================================================
   EVENT BUTTON
===================================================== */

loginButton.addEventListener(
    "click",
    login
);


adminButton.addEventListener(
    "click",
    bukaDenganAdmin
);


submitButton.addEventListener(
    "click",
    kumpulkanUjian
);


/* =====================================================
   ENTER LOGIN
===================================================== */

passwordInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            login();

        }

    }
);


/* =====================================================
   ENTER PASSWORD ADMIN
===================================================== */

adminPasswordInput.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            bukaDenganAdmin();

        }

    }
);


/* =====================================================
   SAAT HALAMAN DIBUKA KEMBALI
===================================================== */

window.addEventListener(
    "load",
    function() {

        const identitas =
            ambilIdentitasSiswa();


        if (
            identitas === null
        ) {

            return;
        }


        const dataSiswa =
            cariSiswa(
                identitas.nama,
                identitas.kelas
            );


        if (
            dataSiswa === null ||
            dataSiswa === undefined
        ) {

            return;
        }


        /*
           Jika siswa sebelumnya
           sudah terkunci, tampilkan
           halaman password admin.
        */

        const statusLock =
            localStorage.getItem(
                getLockKey(
                    dataSiswa
                )
            );


        if (
            statusLock === "true"
        ) {

            siswaAktif =
                dataSiswa;

            ujianAktif =
                false;

            ujianTerkunci =
                true;


            loginPage.classList.add(
                "hidden"
            );

            examPage.classList.add(
                "hidden"
            );

            finishPage.classList.add(
                "hidden"
            );

            lockPage.classList.remove(
                "hidden"
            );


            document.getElementById(
                "lockReason"
            ).textContent =
                "Siswa " +
                dataSiswa.nama +
                " dari kelas " +
                dataSiswa.kelas +
                " masih terkunci.";


            adminPasswordInput.value =
                "";

        }

    }
);


/* =====================================================
   PASSWORD TIDAK DISIMPAN
===================================================== */

passwordInput.value = "";

adminPasswordInput.value = "";
