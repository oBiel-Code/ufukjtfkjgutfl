document.addEventListener("DOMContentLoaded", () => {
    // Animação de fade in para o body
    document.body.style.opacity = "0"
    document.body.style.transition = "opacity 1s ease-in-out"
  
    setTimeout(() => {
      document.body.style.opacity = "1"
    }, 100)
  
    const colors = ["#8a2be2", "#9b59b6", "#4169e1", "#6495ed", "#9370db", "#7b68ee", "#800080"]
  
    // Criar mais confetes para um efeito melhor
    for (let i = 0; i < 150; i++) {
      createConfetti(colors[Math.floor(Math.random() * colors.length)])
    }
  
    // Adicionar efeito de brilho ao troféu
    const trophy = document.querySelector(".trophy")
    setInterval(() => {
      const sparkle = document.createElement("div")
      sparkle.style.position = "absolute"
      sparkle.style.width = "5px"
      sparkle.style.height = "5px"
      sparkle.style.borderRadius = "50%"
      sparkle.style.backgroundColor = "gold"
      sparkle.style.boxShadow = "0 0 10px 2px gold"
  
      // Posicionar brilho aleatoriamente ao redor do troféu
      const x = 40 + (Math.random() * 60 - 30)
      const y = 40 + (Math.random() * 60 - 30)
      sparkle.style.left = `calc(50% - ${x}px)`
      sparkle.style.top = `${y}px`
  
      // Adicionar animação
      sparkle.style.animation = "sparkle 1s forwards"
      sparkle.style.opacity = "0"
  
      trophy.appendChild(sparkle)
  
      // Remover brilho após a animação
      setTimeout(() => {
        sparkle.remove()
      }, 1000)
    }, 200)
  
    // Adicionar efeito de rotação 3D ao container de sucesso
    const successContainer = document.querySelector(".success-container")
    document.addEventListener("mousemove", (e) => {
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight
  
      const tiltX = (y - 0.5) * 10 // -5 a 5 graus
      const tiltY = (0.5 - x) * 10 // -5 a 5 graus
  
      successContainer.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
    })
  
    // Resetar transformação quando o mouse sair
    document.addEventListener("mouseleave", () => {
      successContainer.style.transform = "perspective(1000px) rotateX(0) rotateY(0)"
    })
  
    // Adicionar CSS para animação de brilho
    const style = document.createElement("style")
    style.textContent = `
      @keyframes sparkle {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(2); opacity: 0; }
      }
    `
    document.head.appendChild(style)
  
    function createConfetti(color) {
      const confetti = document.createElement("div")
      confetti.className = "confetti"
      confetti.style.backgroundColor = color
      confetti.style.left = Math.random() * 100 + "vw"
      confetti.style.animationDelay = Math.random() * 5 + "s"
      confetti.style.width = Math.random() * 10 + 5 + "px"
      confetti.style.height = Math.random() * 10 + 5 + "px"
  
      // Adicionar rotação para confetes mais realistas
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`
  
      // Adicionar formas diferentes
      if (Math.random() > 0.6) {
        confetti.style.borderRadius = "50%"
      } else if (Math.random() > 0.5) {
        confetti.style.borderRadius = "0"
      } else {
        confetti.style.width = "8px"
        confetti.style.height = "8px"
        confetti.style.transform += " rotate(45deg)"
      }
  
      // Adicionar efeito de brilho
      confetti.style.boxShadow = `0 0 5px ${color}`
  
      document.body.appendChild(confetti)
  
      // Remover confete após a animação
      setTimeout(() => {
        confetti.remove()
      }, 5000)
    }
  
    // Adicionar efeito de hover ao botão jogar novamente
    const playAgainButton = document.querySelector(".play-again")
    playAgainButton.addEventListener("mouseenter", () => {
      playAgainButton.style.transform = "translateY(-5px)"
      playAgainButton.style.boxShadow = "0 0 30px rgba(138, 43, 226, 0.8)"
    })
  
    playAgainButton.addEventListener("mouseleave", () => {
      playAgainButton.style.transform = ""
      playAgainButton.style.boxShadow = ""
    })
  })
  