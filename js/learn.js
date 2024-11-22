const app = Vue.createApp({
  data() {
    return {
      tags: [
        "random",
        "saludos", "despedidas", "preguntas_sobre_escape", "participacion_chat",
        "agradecimientos", "emociones", "interaccion", "juego", "bromas"
      ],
      selectedTag: "random", // Tag seleccionado por defecto
      newPatterns: "",
      newResponses: "",
      outputJson: {}, // Resultado JSON para mostrar en la UI
      enviado: ""
    };
  },
  methods: {
    // Método para cargar la URL desde localStorage
    getApiUrl() {
      const apiUrl = localStorage.getItem("apiUrl");
      if (!apiUrl) {
        alert("No se ha configurado la URL de la API. Por favor, configúrala antes de enviar datos.");
        throw new Error("URL de API no configurada");
      }
      return apiUrl;
    },

    sendData() {
      try {
        // Obtener la URL desde localStorage
        const apiUrl = this.getApiUrl();
        
        // Preparar los datos
        const patternsArray = this.newPatterns.split(",").map(p => p.trim()).filter(Boolean);
        const responsesArray = this.newResponses.split(",").map(r => r.trim()).filter(Boolean);

        const payload = {
          tag: this.selectedTag,
          patterns: patternsArray,
          responses: responsesArray
        };

        // Actualizar el resultado JSON en la UI
        this.outputJson = payload;
        this.enviado = "Enviaste Esto:";

        // Enviar al endpoint
        fetch(`${apiUrl}/learn`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        })
          .then(response => {
            if (!response.ok) {
              throw new Error("Error en la respuesta de la API");
            }
            return response.json();
          })
          .then(data => {
            alert("Datos enviados correctamente: " + JSON.stringify(data));
          })
          .catch(error => {
            console.error("Error al enviar datos:", error);
            alert("Hubo un error al enviar los datos.");
          });

        // Limpiar inputs
        this.newPatterns = "";
        this.newResponses = "";
      } catch (error) {
        console.error("Error en el proceso de envío:", error);
      }
    }
  }
});

app.mount("#app");
