document.addEventListener("DOMContentLoaded", () => {
  // Navigation scroll behavior
  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = e.currentTarget.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Offset for sticky header
          behavior: "smooth",
        });
      }
    });
  });

  // Active nav on scroll
  const sections = document.querySelectorAll("section");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { rootMargin: "-20% 0px -80% 0px" }
  );

  sections.forEach((section) => observer.observe(section));

  // Association Rules Chart Demo
  const supportSlider = document.getElementById("supportSlider");
  const confidenceSlider = document.getElementById("confidenceSlider");
  const supportValue = document.getElementById("supportValue");
  const confidenceValue = document.getElementById("confidenceValue");
  const ctx = document.getElementById("rulesChart").getContext("2d");

  const initialData = [1000, 850, 600, 350, 150, 50, 10];
  let rulesChart;

  function updateChart() {
    const support = parseInt(supportSlider.value);
    const confidence = parseInt(confidenceSlider.value);

    supportValue.textContent = `${support}%`;
    confidenceValue.textContent = `${confidence}%`;

    const filteredData = initialData.map((val) => {
      let newVal =
        val * (1 - (support - 1) / 80) * (1 - (confidence - 10) / 150);
      return Math.max(0, Math.round(newVal));
    });

    const totalRules = filteredData.reduce((a, b) => a + b, 0);

    rulesChart.data.datasets[0].data = filteredData;
    rulesChart.options.plugins.title.text = `Total de Reglas Descubiertas: ${totalRules}`;
    rulesChart.update();
  }

  rulesChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Pan", "Leche", "Huevos", "Cerveza", "Pañales", "Queso", "Vino"],
      datasets: [
        {
          label: "Número de Reglas de Asociación",
          data: initialData,
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Total de Reglas Descubiertas: 2010",
          font: { size: 14 },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `Reglas con '${context.label}': ${context.raw}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Nº de Reglas",
          },
        },
        x: {
          title: {
            display: true,
            text: "Ítems",
          },
        },
      },
    },
  });

  updateChart();
  supportSlider.addEventListener("input", updateChart);
  confidenceSlider.addEventListener("input", updateChart);

  // Decision Helper Logic
  const decisionYes = document.getElementById("decision-yes");
  const decisionNo = document.getElementById("decision-no");
  const resultContainer = document.getElementById("decision-result");
  const resultContent = document.getElementById("result-content");

  const results = {
    yes: {
      title: "Patrones Secuenciales",
      color: "amber",
      text: "Su análisis debe centrarse en encontrar el orden de los eventos. Esta técnica le permitirá predecir comportamientos futuros, analizar trayectorias de clientes y optimizar procesos a lo largo del tiempo.",
      icon: "⏳",
    },
    no: {
      title: "Análisis de Asociaciones",
      color: "blue",
      text: "Su objetivo es encontrar qué elementos aparecen juntos. Esta técnica es ideal para el análisis de la cesta de la compra, sistemas de recomendación y segmentación de clientes basada en afinidades.",
      icon: "🛒",
    },
  };

  function showResult(type) {
    const data = results[type];
    decisionYes.classList.toggle("active", type === "yes");
    decisionNo.classList.toggle("active", type === "no");

    resultContent.innerHTML = `
                    <div class="flex flex-col sm:flex-row items-center gap-4 text-left">
                         <div class="flex-shrink-0 p-3 bg-${data.color}-100 rounded-full">
                            <span class="text-3xl">${data.icon}</span>
                        </div>
                        <div>
                            <h4 class="text-xl font-bold text-${data.color}-600">${data.title}</h4>
                            <p class="mt-1 text-slate-600">${data.text}</p>
                        </div>
                    </div>
                `;
    resultContainer.classList.remove("opacity-0");
  }

  decisionYes.addEventListener("click", () => showResult("yes"));
  decisionNo.addEventListener("click", () => showResult("no"));
});
