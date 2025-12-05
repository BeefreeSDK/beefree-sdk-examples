import { useEffect } from "react"
import BeefreeSDK from '@beefree.io/sdk'
import { useBuilder } from "../hooks/useBuilder.tsx"
import { useToken } from "../hooks/useToken.ts"
import type { Authorizer } from "../api/Authorizer.ts"
import { DEFAULT_TEMPLATE_URL } from "../config/constants.ts"

type Props = {
  authorizer: Authorizer
  style?: React.CSSProperties
  className?: string
}

export function SimpleBuilder({ authorizer, style, className }: Props) {
  const { token, loading, error } = useToken(authorizer);
  const { builderRef, setBuilder, config } = useBuilder()

  useEffect(() => {
    if (builderRef.current === null && token) {
        const instance = new BeefreeSDK(token)
        console.log('- Editor instance created')
        
        // Async function to handle template loading and builder initialization
        const initializeBuilder = async () => {
          try {
            // Load the default template from the URL
            const res = await fetch(DEFAULT_TEMPLATE_URL)
            const template = await res.json()
            await instance.start(config, template)
            setBuilder(instance)
          } catch (err) {
            console.error('Failed to load default template:', err)
            // Fallback to empty template if fetch fails
            await instance.start(config, {})
            setBuilder(instance)
          }
        }

        initializeBuilder()
    }
  }, [token, config, setBuilder, builderRef])

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div id={config.container} style={style} className={className}/>
  )
}
