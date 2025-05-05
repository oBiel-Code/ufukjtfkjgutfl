document.addEventListener("DOMContentLoaded", () => {
    const difficultyScreen = document.getElementById("difficulty-screen")
    const gameScreen = document.getElementById("game-screen")
    const button = document.getElementById("catch-button")
    const attemptCounter = document.getElementById("attempt-count")
    const gameContainer = document.querySelector(".game-container")
    const popupContainer = document.getElementById("popup-container")
    const popupMessage = document.getElementById("popup-message")
    const popupClose = document.getElementById("popup-close")
    const currentDifficultySpan = document.getElementById("current-difficulty")
    const changeDifficultyBtn = document.getElementById("change-difficulty")
  
    let attempts = 0
    let consecutiveMisses = 0
    let selectedDifficulty = localStorage.getItem("selectedDifficulty") || null
  
    // Configurações para cada nível de dificuldade
    const difficultySettings = {
      facil: {
        name: "Fácil",
        moveThreshold: 350, // Distância maior para começar a mover (mais fácil)
        moveDistance: 100, // Distância menor de movimento (mais fácil)
        moveSpeed: 0.8, // Velocidade mais lenta (mais fácil)
        consecutiveMissesThreshold: 15, // Mais tentativas antes de mostrar mensagem
      },
      medio: {
        name: "Médio",
        moveThreshold: 300,
        moveDistance: 150,
        moveSpeed: 0.6,
        consecutiveMissesThreshold: 10,
      },
      dificil: {
        name: "Difícil",
        moveThreshold: 250, // Distância menor para começar a mover (mais difícil)
        moveDistance: 200, // Distância maior de movimento (mais difícil)
        moveSpeed: 0.4, // Velocidade mais rápida (mais difícil)
        consecutiveMissesThreshold: 5, // Menos tentativas antes de mostrar mensagem
      },
    }
  
    // Mensagens humorísticas em português
    const funnyMessages = [
      "Está difícil, hein? O botão está mais rápido que você!",
      "Opa! Parece que alguém precisa melhorar a mira...",
      "Calma, respira fundo... O botão não morde!",
      "Você está jogando ou só decorando a tela?",
      "Talvez você deveria tentar usar os dois olhos!",
      "O botão está zombando de você agora!",
      "Já pensou em uma carreira como atirador? Não recomendo...",
      "Até minha vovó conseguiria pegar esse botão!",
      "Você está tentando não acertar de propósito?",
      "Isso é um teste de paciência e você está falhando!",
      "Tente imaginar que o botão é uma pizza. Funciona para mim!",
      "Você está deixando o botão ganhar de propósito, certo?",
      "Não desista! Ou melhor, talvez seja hora de desistir...",
      "Esse botão tem superpoderes ou você que é muito lento?",
      "Vamos lá! Meu hamster tem reflexos melhores que isso!",
    ]
  
    // Mensagens específicas para cada dificuldade
    const difficultyMessages = {
      facil: [
        "Mesmo no modo fácil está complicado, hein?",
        "Talvez você deveria tentar o modo 'super ultra mega fácil'...",
        "O botão está no modo fácil, mas parece que você está no modo 'impossível'!",
      ],
      medio: [
        "Nível médio está te desafiando? Interessante...",
        "Nem fácil, nem difícil, mas você continua errando!",
        "Talvez você deveria voltar para o modo fácil...",
      ],
      dificil: [
        "Uau! Você é corajoso tentando o modo difícil!",
        "Modo difícil não é para qualquer um, claramente...",
        "Não se preocupe, quase ninguém consegue no modo difícil!",
      ],
    }
  
    // Inicializar o jogo
    initGame()
  
    function initGame() {
      // Verificar se já existe uma dificuldade selecionada
      if (selectedDifficulty && Object.keys(difficultySettings).includes(selectedDifficulty)) {
        startGame(selectedDifficulty)
      } else {
        // Mostrar tela de seleção de dificuldade
        difficultyScreen.style.display = "flex"
        gameScreen.classList.add("hidden")
  
        // Adicionar event listeners para os botões de dificuldade
        const difficultyButtons = document.querySelectorAll(".difficulty-btn")
        difficultyButtons.forEach((btn) => {
          btn.addEventListener("click", () => {
            const difficulty = btn.getAttribute("data-difficulty")
            localStorage.setItem("selectedDifficulty", difficulty)
            selectedDifficulty = difficulty
            startGame(difficulty)
          })
        })
      }
    }
  
    function startGame(difficulty) {
      // Esconder tela de seleção e mostrar o jogo
      difficultyScreen.style.display = "none"
      gameScreen.classList.remove("hidden")
  
      // Adicionar classe de dificuldade ao game screen
      gameScreen.className = "game-screen"
      gameScreen.classList.add(`difficulty-${difficulty}`)
  
      // Atualizar o indicador de dificuldade
      currentDifficultySpan.textContent = difficultySettings[difficulty].name
      currentDifficultySpan.className = ""
      currentDifficultySpan.classList.add(difficulty)
  
      // Criar partículas flutuantes
      createParticles()
  
      // Criar efeito de rastro do mouse
      document.addEventListener("mousemove", createTrail)
  
      // Posição inicial
      positionButton()
  
      // Rastrear movimento do mouse
      document.addEventListener("mousemove", (e) => {
        const buttonRect = button.getBoundingClientRect()
        const buttonCenterX = buttonRect.left + buttonRect.width / 2
        const buttonCenterY = buttonRect.top + buttonRect.height / 2
  
        const mouseX = e.clientX
        const mouseY = e.clientY
  
        // Calcular distância entre o mouse e o botão
        const distance = Math.sqrt(Math.pow(mouseX - buttonCenterX, 2) + Math.pow(mouseY - buttonCenterY, 2))
  
        // Se o mouse estiver se aproximando, mover o botão
        // Usar o limiar baseado na dificuldade
        if (distance < difficultySettings[difficulty].moveThreshold) {
          moveButton(difficulty)
        }
      })
  
      // Lidar com clique no botão
      button.addEventListener("click", () => {
        // Adicionar animação de sucesso antes do redirecionamento
        button.style.animation = "none"
        button.offsetHeight // Forçar reflow
        button.style.animation = "pulse 0.5s"
        button.style.background = "linear-gradient(135deg, #2ecc71, #3498db)"
        button.textContent = "Peguei!"
        button.style.transform = "scale(1.2)"
  
        // Criar partículas de sucesso
        createSuccessParticles(button)
  
        // Redirecionar após um pequeno atraso para mostrar a animação de sucesso
        setTimeout(() => {
          // Efeito de fade out antes do redirecionamento
          document.body.style.animation = "fadeOut 0.5s forwards"
  
          setTimeout(() => {
            window.location.href = "success.html"
          }, 500)
        }, 1000)
      })
  
      // Lidar com cliques perdidos
      document.addEventListener("click", (e) => {
        if (e.target !== button && e.target !== popupClose && e.target !== changeDifficultyBtn) {
          attempts++
          consecutiveMisses++
          attemptCounter.textContent = attempts
  
          // Criar efeito de clique
          createClickEffect(e.clientX, e.clientY)
  
          // Tremer o contador de tentativas
          const attemptsElement = document.querySelector(".attempts")
          attemptsElement.style.animation = "none"
          attemptsElement.offsetHeight // Forçar reflow
          attemptsElement.style.animation = "shake 0.5s"
  
          // Mostrar mensagem humorística após X cliques consecutivos perdidos (baseado na dificuldade)
          if (consecutiveMisses >= difficultySettings[difficulty].consecutiveMissesThreshold) {
            showFunnyMessage(difficulty)
            consecutiveMisses = 0 // Resetar contador após mostrar a mensagem
          }
        }
      })
  
      // Botão para mudar dificuldade
      changeDifficultyBtn.addEventListener("click", () => {
        localStorage.removeItem("selectedDifficulty")
        location.reload()
      })
    }
  
    // Fechar popup
    popupClose.addEventListener("click", () => {
      popupContainer.classList.remove("show")
    })
  
    function positionButton() {
      const maxX = window.innerWidth - button.offsetWidth
      const maxY = window.innerHeight - button.offsetHeight
  
      const randomX = Math.floor(Math.random() * maxX)
      const randomY = Math.floor(Math.random() * maxY)
  
      button.style.left = randomX + "px"
      button.style.top = randomY + "px"
    }
  
    function moveButton(difficulty) {
      const maxX = window.innerWidth - button.offsetWidth
      const maxY = window.innerHeight - button.offsetHeight
  
      // Obter posição atual
      const currentX = Number.parseInt(button.style.left) || 0
      const currentY = Number.parseInt(button.style.top) || 0
  
      // Gerar nova posição (distância baseada na dificuldade)
      let newX, newY
      const moveDistance = difficultySettings[difficulty].moveDistance
  
      do {
        newX = currentX + (Math.random() * moveDistance * 2 - moveDistance)
        newY = currentY + (Math.random() * moveDistance * 2 - moveDistance)
  
        // Manter o botão dentro da viewport
        newX = Math.max(0, Math.min(maxX, newX))
        newY = Math.max(0, Math.min(maxY, newY))
  
        // Garantir que o botão realmente se mova, mas não muito longe
      } while (Math.abs(newX - currentX) < 30 && Math.abs(newY - currentY) < 30)
  
      // Adicionar transição para movimento mais suave (velocidade baseada na dificuldade)
      const moveSpeed = difficultySettings[difficulty].moveSpeed
      button.style.transition = `left ${moveSpeed}s ease-out, top ${moveSpeed}s ease-out`
      button.style.left = newX + "px"
      button.style.top = newY + "px"
  
      // Remover transição após o movimento para evitar lag
      setTimeout(() => {
        button.style.transition = "none"
      }, moveSpeed * 1000)
    }
  
    function createClickEffect(x, y) {
      const effect = document.createElement("div")
      effect.className = "click-effect"
      effect.style.left = x + "px"
      effect.style.top = y + "px"
      gameContainer.appendChild(effect)
  
      // Remover efeito após a animação completar
      setTimeout(() => {
        effect.remove()
      }, 800)
    }
  
    function createParticles() {
      const colors = ["#8a2be2", "#9b59b6", "#4169e1", "#6495ed", "#9370db"]
  
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement("div")
        particle.className = "particle"
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
        particle.style.left = Math.random() * 100 + "vw"
        particle.style.top = Math.random() * 100 + "vh"
        particle.style.animationDuration = Math.random() * 15 + 10 + "s"
        document.body.appendChild(particle)
      }
    }
  
    function createTrail(e) {
      // Criar efeito de rastro a cada poucos movimentos
      if (Math.random() > 0.9) {
        const trail = document.createElement("div")
        trail.className = "trail"
        trail.style.left = e.clientX + "px"
        trail.style.top = e.clientY + "px"
        document.body.appendChild(trail)
  
        // Remover rastro após a animação
        setTimeout(() => {
          trail.remove()
        }, 1000)
      }
    }
  
    function createSuccessParticles(button) {
      const buttonRect = button.getBoundingClientRect()
      const centerX = buttonRect.left + buttonRect.width / 2
      const centerY = buttonRect.top + buttonRect.height / 2
  
      const colors = ["#8a2be2", "#9b59b6", "#4169e1", "#6495ed", "#9370db"]
  
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement("div")
        particle.style.position = "absolute"
        particle.style.width = Math.random() * 10 + 5 + "px"
        particle.style.height = particle.style.width
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
        particle.style.borderRadius = "50%"
        particle.style.left = centerX + "px"
        particle.style.top = centerY + "px"
        particle.style.pointerEvents = "none"
        particle.style.boxShadow = "0 0 10px " + colors[Math.floor(Math.random() * colors.length)]
  
        // Direção aleatória
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 5 + 3
        const vx = Math.cos(angle) * speed
        const vy = Math.sin(angle) * speed
  
        // Animação
        particle.style.animation = "particleExplode 1s forwards"
        particle.style.transform = `translate(${vx * 20}px, ${vy * 20}px)`
  
        document.body.appendChild(particle)
  
        setTimeout(() => {
          particle.remove()
        }, 1000)
      }
    }
  
    function showFunnyMessage(difficulty) {
      // Combinar mensagens gerais com mensagens específicas da dificuldade
      const allMessages = [...funnyMessages]
  
      if (difficultyMessages[difficulty]) {
        allMessages.push(...difficultyMessages[difficulty])
      }
  
      // Selecionar uma mensagem aleatória
      const randomMessage = allMessages[Math.floor(Math.random() * allMessages.length)]
      popupMessage.textContent = randomMessage
  
      // Mostrar o popup
      popupContainer.classList.add("show")
  
      // Fechar automaticamente após 4 segundos
      setTimeout(() => {
        popupContainer.classList.remove("show")
      }, 4000)
    }
  
    // Adicionar CSS para novas animações
    const style = document.createElement("style")
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
      
      @keyframes particleExplode {
        0% { 
          opacity: 1;
          transform: translate(0, 0) scale(1);
        }
        100% { 
          opacity: 0;
          transform: translate(var(--tx, 100px), var(--ty, 100px)) scale(0);
        }
      }
      
      @keyframes fadeOut {
        to { opacity: 0; }
      }
    `
    document.head.appendChild(style)
  })
  