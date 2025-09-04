import BeefreeSDK from '@beefree.io/sdk'
import { IBeeConfig, IEntityContentJson, IToken, BuilderType, BeefreeInstance } from '../types'
import { BUILDER_CONFIGS, BASE_BEEFREE_CONFIG } from '../config/constants'

export class BeefreeMultiService {
  private beeInstance: BeefreeInstance | null = null
  private currentBuilderType: BuilderType | null = null

  /**
   * Load template for specific builder type
   */
  async loadTemplate(builderType: BuilderType): Promise<IEntityContentJson> {
    try {
      const config = BUILDER_CONFIGS[builderType]
      console.log(`📄 Loading ${config.label} template from: ${config.templateUrl}`)
      
      const response = await fetch(config.templateUrl)
      
      if (!response.ok) {
        throw new Error(`Failed to load ${builderType} template: ${response.status}`)
      }
      
      const responseData = await response.json()
      
      // Check if the template is wrapped in a "json" property (common for Page/Popup builders)
      // The Beefree SDK expects the "page" property to be at the root level, so we need to
      // verify the server response structure and extract the correct template data
      const template = responseData.json || responseData
      
      console.log(`📄 ${config.label} template loaded successfully:`, {
        templateUrl: config.templateUrl,
        responseKeys: Object.keys(responseData),
        templateKeys: Object.keys(template),
        hasJsonWrapper: !!responseData.json,
        hasPage: !!template.page,
        hasRows: template.page?.rows ? template.page.rows.length : 'no rows property'
      })
      
      return template
    } catch (error) {
      console.error(`❌ Error loading ${builderType} template:`, error)
      throw error
    }
  }

  /**
   * Get builder-specific configuration
   */
  private getBuilderConfig(builderType: BuilderType, uid: string): IBeeConfig {
    const config: IBeeConfig = {
      ...BASE_BEEFREE_CONFIG,
      uid: uid,
    }

    // Add builder-specific configurations if needed
    switch (builderType) {
      case 'email':
        // Email-specific configuration
        console.log(`⚙️ Using Email Builder configuration`)
        break
      case 'page':
        // Page-specific configuration - might need different settings
        console.log(`⚙️ Using Page Builder configuration`)
        // Page builder might need specific configuration
        // Note: workspace configuration removed due to TypeScript type constraints
        break
      case 'popup':
        // Popup-specific configuration - might need different settings
        console.log(`⚙️ Using Popup Builder configuration`)
        // Popup builder might need specific configuration
        // Note: workspace configuration removed due to TypeScript type constraints
        break
    }

    console.log(`⚙️ Final config for ${builderType}:`, config)
    return config
  }

  /**
   * Initialize Beefree SDK for specific builder type
   */
  async initializeBuilder(
    token: IToken,
    uid: string,
    builderType: BuilderType
  ): Promise<BeefreeInstance> {
    try {
      // Check if container exists in DOM
      const container = document.getElementById(BASE_BEEFREE_CONFIG.container)
      if (!container) {
        throw new Error(`Container element with id '${BASE_BEEFREE_CONFIG.container}' not found in DOM`)
      }

      // Destroy existing instance if present
      if (this.beeInstance) {
        await this.destroyBuilder()
      }

      console.log(`🚀 Initializing ${BUILDER_CONFIGS[builderType].label}...`)

      // Load template for the specific builder type
      const templateData = await this.loadTemplate(builderType)
      
      // Get builder-specific configuration
      const clientConfig = this.getBuilderConfig(builderType, uid)
      
      // Initialize Beefree SDK
      // Note: Double casting needed due to Beefree SDK internal type structure
      this.beeInstance = new BeefreeSDK(token) as unknown as BeefreeInstance
      
      // Store reference globally and start SDK
      window.bee = this.beeInstance
      this.currentBuilderType = builderType
      
      // Start the builder with proper typing
      await this.beeInstance.start(clientConfig, templateData)
      
      console.log(`✅ ${BUILDER_CONFIGS[builderType].label} initialized successfully`)
      return this.beeInstance

    } catch (error) {
      console.error(`❌ Failed to initialize ${builderType} builder:`, error)
      this.beeInstance = null
      this.currentBuilderType = null
      throw error
    }
  }

  /**
   * Switch to a different builder type
   */
  async switchBuilder(
    token: IToken,
    uid: string,
    newBuilderType: BuilderType
  ): Promise<BeefreeInstance> {
    if (this.currentBuilderType === newBuilderType && this.beeInstance) {
      console.log(`🔄 Already using ${BUILDER_CONFIGS[newBuilderType].label}`)
      return this.beeInstance
    }

    console.log(`🔄 Switching from ${this.currentBuilderType || 'none'} to ${newBuilderType}`)
    
    // Initialize the new builder (this will destroy the old one)
    return await this.initializeBuilder(token, uid, newBuilderType)
  }

  /**
   * Destroy current builder instance
   */
  async destroyBuilder(): Promise<void> {
    if (this.beeInstance) {
      try {
        console.log(`🗑️ Destroying ${this.currentBuilderType || 'current'} builder...`)
        
        // Check if destroy method exists before calling it
        if (typeof this.beeInstance.destroy === 'function') {
          await this.beeInstance.destroy()
        }
        
        this.beeInstance = null
        this.currentBuilderType = null
        window.bee = undefined
        
        console.log('✅ Builder destroyed successfully')
      } catch (error) {
        console.error('❌ Error destroying builder:', error)
        // Reset state even if destroy failed
        this.beeInstance = null
        this.currentBuilderType = null
        window.bee = undefined
      }
    }
  }

  /**
   * Get current builder instance
   */
  getInstance(): BeefreeInstance | null {
    return this.beeInstance
  }

  /**
   * Get current builder type
   */
  getCurrentBuilderType(): BuilderType | null {
    return this.currentBuilderType
  }

  /**
   * Check if a builder is currently initialized
   */
  isInitialized(): boolean {
    return this.beeInstance !== null
  }
}
