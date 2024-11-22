const app = Vue.createApp({
  data() {
    return {
      nickname: '', // Nickname del usuario
      nicknameInput: '', // Campo editable del nickname
      editingNickname: false, // Estado para editar nickname
      userMessage: '', // Mensaje del usuario
      messages: [
        { text: 'escribe lo que sea', type: 'la sweetbloomie hdtpm' },
      ], // Lista de mensajes
      apiUrl: '', // URL de la API
      apiUrlInput: '', // Campo editable de la URL de la API
    };
  },
  created() {
    this.loadNickname(); // Cargar nickname al iniciar
    this.loadApiUrl(); // Cargar URL de la API al iniciar
  },
  methods: {
    // Cargar nickname desde localStorage
    loadNickname() {
      const savedNickname = localStorage.getItem('nickname');
      if (savedNickname) {
        this.nickname = savedNickname;
      } else {
        this.editingNickname = true; // Si no existe, solicitar nickname
      }
    },
    // Guardar nickname en localStorage
    saveNickname() {
      if (this.nicknameInput.trim()) {
        this.nickname = this.nicknameInput.trim();
        this.editingNickname = false;
        localStorage.setItem('nickname', this.nickname); // Guardar en localStorage
      }
    },
    // Permitir editar nickname
    editNickname() {
      this.nicknameInput = this.nickname;
      this.editingNickname = true;
      this.$nextTick(() => {
        const inputField = document.querySelector('.nickname-input');
        inputField && inputField.focus();
      });
    },
    // Cargar URL de la API desde localStorage
    loadApiUrl() {
      const savedApiUrl = localStorage.getItem('apiUrl');
      if (savedApiUrl) {
        this.apiUrl = savedApiUrl;
        this.apiUrlInput = savedApiUrl;
      } else {
        alert('Por favor, configure la URL de la API.');
      }
    },
    // Guardar URL de la API en localStorage
    saveApiUrl() {
      if (this.apiUrlInput.trim()) {
        this.apiUrl = this.apiUrlInput.trim();
        localStorage.setItem('apiUrl', this.apiUrl); // Guardar en localStorage
        alert('URL de la API guardada.');
      } else {
        alert('La URL de la API no puede estar vacía.');
      }
    },
    // Enviar mensaje a la API
    async sendMessage() {
      if (!this.nickname.trim()) {
        alert('Por favor, ingrese un nickname antes de enviar un mensaje.');
        return; // No enviar el mensaje si el nickname está vacío
      }
      if (!this.apiUrl) {
        alert('Por favor, configure una URL de API válida antes de enviar mensajes.');
        return;
      }
      if (!this.userMessage.trim()) return; // Si el mensaje está vacío, no se envía

      // Añadir mensaje del usuario a la vista
      this.messages.push({ text: `${this.nickname}: ${this.userMessage}`, type: 'user' });

      const userInput = this.userMessage; // Guardar el input del usuario
      this.userMessage = ''; // Limpiar campo de entrada

      // Llamar a la API
      try {
        const response = await fetch(this.apiUrl + "/chat", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: userInput, username: this.nickname }),
        });

        if (!response.ok) {
          throw new Error('Error en la respuesta de la API');
        }

        const data = await response.json();
        // Añadir respuesta del bot a la vista
        this.messages.push({ text: `la sweetbloomah: ${data.reply}`, type: 'bot' });
      } catch (error) {
        console.error('Error:', error);
        this.messages.push({ text: 'Error communicating with the bot.', type: 'bot' });
      }
    },
  },
});

app.mount('#app');
