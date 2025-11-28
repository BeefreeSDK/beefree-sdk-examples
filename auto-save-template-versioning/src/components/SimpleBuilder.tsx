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
        
        // Load the default template from the URL
        fetch(DEFAULT_TEMPLATE_URL)
          .then(res => res.json())
          .then(template => {
            instance.start(config, template)
            setBuilder(instance)
          })
          .catch(err => {
            console.error('Failed to load default template:', err)
            // Fallback to empty template if fetch fails
            instance.start(config, {})
            setBuilder(instance)
          })
    }
  }, [token, config, setBuilder, builderRef])

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div id={config.container} style={style} className={className}/>
  )
}
