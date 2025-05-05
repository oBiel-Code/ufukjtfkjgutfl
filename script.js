document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("catch-button")
    const attemptCounter = document.getElementById("attempt-count")
    const gameContainer = document.querySelector(".game-container")
    const popupContainer = document.getElementById("popup-container")
    const popupMessage = document.getElementById("popup-message")
    const popupClose = document.getElementById("popup-close")
  
    let attempts = 0
    let consecutiveMisses = 0
  
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
      // Limiar aumentado para 300px para facilitar a captura
      if (distance < 300) {
        moveButton()
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
      if (e.target !== button && e.target !== popupClose) {
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
  
        // Mostrar mensagem humorística após 10 cliques consecutivos perdidos
        if (consecutiveMisses >= 10) {
          showFunnyMessage()
          consecutiveMisses = 0 // Resetar contador após mostrar a mensagem
        }
      }
    })
  
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
  
    function moveButton() {
      const maxX = window.innerWidth - button.offsetWidth
      const maxY = window.innerHeight - button.offsetHeight
  
      // Obter posição atual
      const currentX = Number.parseInt(button.style.left) || 0
      const currentY = Number.parseInt(button.style.top) || 0
  
      // Gerar nova posição (distância de movimento reduzida para facilitar a captura)
      let newX, newY
  
      do {
        // Distância de movimento reduzida de 300 para 150
        newX = currentX + (Math.random() * 150 - 75)
        newY = currentY + (Math.random() * 150 - 75)
  
        // Manter o botão dentro da viewport
        newX = Math.max(0, Math.min(maxX, newX))
        newY = Math.max(0, Math.min(maxY, newY))
  
        // Garantir que o botão realmente se mova, mas não muito longe
      } while (Math.abs(newX - currentX) < 30 && Math.abs(newY - currentY) < 30)
  
      // Adicionar transição para movimento mais suave
      button.style.transition = "left 0.6s ease-out, top 0.6s ease-out"
      button.style.left = newX + "px"
      button.style.top = newY + "px"
  
      // Remover transição após o movimento para evitar lag
      setTimeout(() => {
        button.style.transition = "none"
      }, 600)
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
  
    function showFunnyMessage() {
      // Selecionar uma mensagem aleatória
      const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)]
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
  