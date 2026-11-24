import { useEffect, useRef, useState } from "react"

const GOOGLE_ID_SCRIPT = "https://accounts.google.com/gsi/client"

export default function GoogleAuthButton({ onCredential, disabled = false }) {
  const buttonRef = useRef(null)
  const credentialHandler = useRef(onCredential)
  const [setupError, setSetupError] = useState("")
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim()

  credentialHandler.current = onCredential

  useEffect(() => {
    if (!clientId) {
      setSetupError("Google sign-in is unavailable until VITE_GOOGLE_CLIENT_ID is configured.")
      return
    }

    let cancelled = false
    const renderGoogleButton = () => {
      if (cancelled) return
      const googleIdentity = window.google?.accounts?.id
      if (!googleIdentity || !buttonRef.current) {
        setSetupError("Google sign-in could not be loaded. Please try again later.")
        return
      }

      googleIdentity.initialize({
        client_id: clientId,
        callback: (response) => {
          if (response.credential) credentialHandler.current(response.credential)
          else setSetupError("Google did not return a sign-in credential.")
        },
      })
      buttonRef.current.replaceChildren()
      googleIdentity.renderButton(buttonRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        width: Math.min(buttonRef.current.clientWidth || 360, 400),
      })
      setSetupError("")
    }

    let script = document.querySelector(`script[src="${GOOGLE_ID_SCRIPT}"]`)
    const handleScriptLoad = () => renderGoogleButton()
    const handleScriptError = () => {
      if (!cancelled) setSetupError("Google sign-in could not be loaded. Please try again later.")
    }

    if (window.google?.accounts?.id) {
      renderGoogleButton()
    } else if (script) {
      script.addEventListener("load", handleScriptLoad)
      script.addEventListener("error", handleScriptError)
    } else {
      script = document.createElement("script")
      script.src = GOOGLE_ID_SCRIPT
      script.async = true
      script.defer = true
      script.addEventListener("load", handleScriptLoad)
      script.addEventListener("error", handleScriptError)
      document.head.appendChild(script)
    }

    return () => {
      cancelled = true
      script?.removeEventListener("load", handleScriptLoad)
      script?.removeEventListener("error", handleScriptError)
    }
  }, [clientId])

  return (
    <div>
      <div
        ref={buttonRef}
        aria-disabled={disabled}
        className={disabled ? "pointer-events-none opacity-60" : ""}
      />
      {setupError && (
        <p role="status" className="mt-2 text-center text-sm text-gray-600">
          {setupError}
        </p>
      )}
    </div>
  )
}
