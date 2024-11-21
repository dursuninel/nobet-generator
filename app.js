// Kişi listesi ve kurallar
const persons = [
  {
    name: "M. Emin",
    gender: "Erkek",
    days: ["Çarşamba", "Perşembe", "Cuma"],
    dutyCount: 0,
  },
  {
    name: "Ekin Arda",
    gender: "Erkek",
    days: ["Pazartesi", "Salı", "Çarşamba"],
    dutyCount: 0,
  },
  {
    name: "Yunus Emre",
    gender: "Erkek",
    days: ["Çarşamba", "Perşembe", "Cuma"],
    dutyCount: 0,
  },
  {
    name: "Ferdi",
    gender: "Erkek",
    days: ["Çarşamba", "Perşembe", "Cuma"],
    dutyCount: 0,
  },
  {
    name: "Kerem",
    gender: "Erkek",
    days: ["Çarşamba", "Perşembe", "Cuma"],
    dutyCount: 0,
  },
  {
    name: "Talha",
    gender: "Erkek",
    days: ["Çarşamba", "Perşembe", "Cuma"],
    dutyCount: 0,
  },
  {
    name: "Zeynep",
    gender: "Kız",
    days: ["Çarşamba", "Perşembe", "Cuma"],
    dutyCount: 0,
  },
  {
    name: "Duru",
    gender: "Kız",
    days: ["Çarşamba", "Perşembe", "Cuma"],
    dutyCount: 0,
  },
  {
    name: "Esra",
    gender: "Kız",
    days: ["Çarşamba", "Perşembe", "Cuma"],
    dutyCount: 0,
  },
  {
    name: "Tuana",
    gender: "Kız",
    days: ["Çarşamba", "Perşembe", "Cuma"],
    dutyCount: 0,
  },
  {
    name: "Eylül",
    gender: "Kız",
    days: ["Çarşamba", "Perşembe", "Cuma"],
    dutyCount: 0,
  },
  {
    name: "Ahmet Hakan",
    gender: "Erkek",
    days: ["Pazartesi", "Salı", "Perşembe", "Cuma"],
    dutyCount: 0,
  },
  {
    name: "Miraç",
    gender: "Erkek",
    days: ["Pazartesi", "Salı", "Perşembe", "Cuma"],
    dutyCount: 0,
  },
  {
    name: "Furkan",
    gender: "Erkek",
    days: ["Pazartesi", "Salı", "Perşembe", "Cuma"],
    dutyCount: 0,
  },
  {
    name: "Sümeyye",
    gender: "Kız",
    days: ["Pazartesi", "Salı", "Perşembe", "Cuma"],
    dutyCount: 0,
  },
  {
    name: "Rengin",
    gender: "Kız",
    days: ["Pazartesi", "Salı", "Perşembe", "Cuma"],
    dutyCount: 0,
  },
];

// Resmi tatiller
const officialHolidays = [
  "2025-01-01",
  "2025-04-23",
  "2025-05-01",
  "2025-05-19",
  "2025-07-15",
  "2025-08-30",
  "2025-10-29",
  "2025-03-30",
  "2025-03-31",
  "2025-04-01",
  "2025-04-02",
  "2025-06-07",
  "2025-06-08",
  "2025-06-09",
  "2025-06-10",
  "2025-06-11",
];

// Yardımcı Fonksiyonlar (Değişiklik yok)
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function getDayName(date) {
  return date.toLocaleDateString("tr-TR", { weekday: "long" });
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function resetDuties() {
  persons.forEach((person) => (person.dutyCount = 0));
}

// Nöbet Atama Fonksiyonu (Değişiklik yok)
function assignDuty(startDate, daysToSchedule) {
  const schedule = [];
  let currentDate = new Date(startDate);

  while (schedule.length < daysToSchedule) {
    const currentDateStr = formatDate(currentDate);
    const currentDay = getDayName(currentDate);

    // Hafta sonu veya resmi tatil kontrolü
    if (
      currentDay === "Cumartesi" ||
      currentDay === "Pazar" ||
      officialHolidays.includes(currentDateStr)
    ) {
      schedule.push(null);
      currentDate = addDays(currentDate, 1);
      continue;
    }

    // Uygun kişiler
    let availablePersons = persons.filter(
      (person) =>
        person.days.includes(currentDay) &&
        !schedule.filter(Boolean).some(
          (s) => s.date === currentDateStr && s.duty.includes(person.name)
        )
    );

    // Daha önce nöbet tutmamışları seç
    let notYetAssigned = availablePersons.filter(
      (person) => person.dutyCount === 0
    );
    if (notYetAssigned.length === 0) {
      resetDuties();
      notYetAssigned = availablePersons;
    }

    // Erkek ve kız listesi oluştur
    const males = shuffle(
      notYetAssigned.filter((person) => person.gender === "Erkek")
    );
    const females = shuffle(
      notYetAssigned.filter((person) => person.gender === "Kız")
    );

    const duty = [];
    if (males.length > 0) duty.push(males[0].name), males[0].dutyCount++;
    if (females.length > 0) duty.push(females[0].name), females[0].dutyCount++;

    // Eğer eksikse tamamla
    if (duty.length < 2) {
      const extra = availablePersons.filter(
        (person) => !duty.includes(person.name)
      );
      if (extra.length > 0) duty.push(extra[0].name), extra[0].dutyCount++;
    }

    if (duty.length > 0) {
      schedule.push({ date: currentDateStr, day: currentDay, duty });
    }

    currentDate = addDays(currentDate, 1);
  }
  return schedule;
}

// Tabloyu Güncelleme
function renderTable(schedule) {
  const tableBody = document.querySelector("#dutyTable tbody");
  tableBody.innerHTML = ""; // Önceki içerikleri temizle

  schedule.filter(Boolean).forEach((entry) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.duty[0] || "Yok"}</td>
      <td>${entry.duty[1] || "Yok"}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Excel İndirme Fonksiyonu (Değişiklik yok)
function downloadScheduleAsExcel(schedule) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Nöbet Listesi");

  // Stil
  const headerStyle = {
    font: { bold: true, color: { argb: "FFFFFF" } },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "4CAF50" } },
    alignment: { horizontal: "center", vertical: "middle" },
  };

  worksheet.columns = [
    { header: "Tarih", key: "date", width: 15 },
    { header: "İlk Nöbetçi", key: "firstDuty", width: 20 },
    { header: "İkinci Nöbetçi", key: "secondDuty", width: 20 },
  ];

  worksheet.getRow(1).eachCell((cell) => (cell.style = headerStyle));

  schedule.filter(Boolean).forEach((entry) => {
    worksheet.addRow({
      date: entry.date,
      firstDuty: entry.duty[0] || "Yok",
      secondDuty: entry.duty[1] || "Yok",
    });
  });

  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Nobet_Listesi.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  });
}

// Listeyi oluştur
let dutySchedule = [];
function generateSchedule() {
  const startDateInput = document.getElementById("startDate").value;
  const endDateInput = document.getElementById("endDate").value;

  if (!startDateInput || !endDateInput) {
    alert("Lütfen başlangıç ve bitiş tarihlerini girin.");
    return;
  }

  const startDate = new Date(startDateInput);
  const endDate = new Date(endDateInput);
  const daysToSchedule =
    Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  console.log(daysToSchedule);
  if (daysToSchedule <= 0) {
    alert("Geçerli bir tarih aralığı seçin.");
    return;
  }

  dutySchedule = assignDuty(formatDate(startDate), daysToSchedule);

  // HTML Tabloya listeyi ekle
  renderTable(dutySchedule);
}

// Event Listener
document
  .getElementById("generateSchedule")
  .addEventListener("click", generateSchedule);
document.getElementById("downloadExcel").addEventListener("click", () => {
  if (dutySchedule.length === 0) {
    alert("Lütfen önce bir nöbet listesi oluşturun.");
    return;
  }
  downloadScheduleAsExcel(dutySchedule);
});
