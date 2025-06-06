import { useState, useEffect, useRef } from 'react'

const useTypewriter = (examples, options = {}) => {
  const {
    typeSpeed = 50,
    deleteSpeed = 30,
    pauseDuration = 2500,
    loop = true,
    autoStart = true
  } = options

  const [currentText, setCurrentText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [isActive, setIsActive] = useState(autoStart)
  
  const timeoutRef = useRef(null)
  const isUserTyping = useRef(false)

  const reset = () => {
    setCurrentText('')
    setCurrentIndex(0)
    setIsTyping(true)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const start = () => {
    if (!isUserTyping.current) {
      setIsActive(true)
    }
  }

  const stop = () => {
    setIsActive(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const handleUserInput = () => {
    isUserTyping.current = true
    setIsActive(false)
    setCurrentText('')
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const handleUserInputEnd = () => {
    isUserTyping.current = false
    // Resume animation after user stops typing for a bit
    timeoutRef.current = setTimeout(() => {
      if (!isUserTyping.current) {
        setIsActive(true)
      }
    }, 3000)
  }

  useEffect(() => {
    if (!isActive || examples.length === 0 || isUserTyping.current) return

    const currentExample = examples[currentIndex]
    
    if (isTyping) {
      // Typing phase
      if (currentText.length < currentExample.length) {
        timeoutRef.current = setTimeout(() => {
          setCurrentText(currentExample.slice(0, currentText.length + 1))
        }, typeSpeed)
      } else {
        // Finished typing, pause then start deleting
        timeoutRef.current = setTimeout(() => {
          setIsTyping(false)
        }, pauseDuration)
      }
    } else {
      // Deleting phase
      if (currentText.length > 0) {
        timeoutRef.current = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1))
        }, deleteSpeed)
      } else {
        // Finished deleting, move to next example
        setIsTyping(true)
        if (loop) {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % examples.length)
        } else if (currentIndex < examples.length - 1) {
          setCurrentIndex(currentIndex + 1)
        } else {
          setIsActive(false)
        }
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [currentText, currentIndex, isTyping, isActive, examples, typeSpeed, deleteSpeed, pauseDuration, loop])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    currentText,
    isActive,
    start,
    stop,
    reset,
    handleUserInput,
    handleUserInputEnd
  }
}

export default useTypewriter