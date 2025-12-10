# 🔀 Beefree SDK Display Conditions Example

A practical, ready-to-run example demonstrating how to integrate the [**Beefree SDK Display Conditions feature**](https://docs.beefree.io/beefree-sdk/other-customizations/advanced-options/display-conditions) into your application. Built with **React 19 + TypeScript + Vite**, this example shows you exactly how to enable personalized email content that adapts based on recipient attributes—all without writing a single line of code.

**Perfect for developers who are:**
- 🆕 New to Beefree SDK and want to see display conditions in action
- 📖 Learning how to implement conditional content and personalization
- 🔨 Building sophisticated email marketing platforms
- 🎯 Looking for production-ready code patterns for dynamic content

> **📋 Plan Requirements**: Display Conditions is available on **Core**, **SuperPowers**, and **Enterprise** plans. It is **not available** on Free and Essentials plans. Check your plan in the [Beefree Developer Console](https://developers.beefree.io/pricing-plans).

> **⚙️ Activation Required**: This feature is **disabled by default**. You must enable it in your [Beefree SDK Console](https://developers.beefree.io/) under Server-side configurations before using it. See [How to Activate](#1-enable-display-conditions-in-your-beefree-sdk-console) below.

---

## ✨ Features Demonstrated

### 🎯 **Personalized Content Creation**
- **No-Code Conditional Logic** - Create personalized content without writing code
- **14 Pre-configured Conditions** - Ready-to-use conditions across 5 categories
- **Custom Condition Builder** - Visual interface to build complex conditions on-the-fly
- **Multi-Rule Logic** - Combine multiple rules with AND operators
- **Language Agnostic** - Works with Liquid, Handlebars, or any templating syntax
- **Real-time Preview** - Test how content appears to different audience segments

### 📋 **Pre-configured Condition Categories**

This example includes 14 professional conditions organized into 5 categories:

#### 👥 **Customer Segment** (3 conditions)
- VIP Customers (loyalty tier)
- Premium Subscribers (subscription level)
- First-time Buyers (customer status)

#### 🌍 **Geography** (3 conditions)
- North America Region
- Europe Region
- Asia Pacific Region

#### 🛍️ **Shopping Behavior** (3 conditions)
- High Cart Value (>$100)
- Frequent Shoppers (>5 purchases)
- Has Active Cart

#### 📦 **Product Catalog** (3 conditions)
- Women's Catalog
- Men's Catalog
- Children's Catalog

#### 📊 **Engagement** (2 conditions)
- Highly Engaged (opened recent emails)
- Inactive Subscribers (no recent engagement)

### 🔧 **Extending Display Conditions - Custom Builder**

The example demonstrates the advanced **Content Dialog** feature, allowing users to build custom conditions through a visual interface:

- **Visual Condition Builder** - User-friendly form to construct conditions
- **Field Selection** - Choose from customer attributes (tier, region, cart value, etc.)
- **Operator Options** - Support for equals, greater than, less than, contains
- **Value Input** - Enter comparison values
- **Multi-Rule Support** - Add multiple rules with AND logic
- **Live Liquid Preview** - See generated syntax in real-time
- **Apply & Test** - Immediately apply to rows and test in Preview mode

### 🏗️ **Modern Architecture**
- **React 19** with functional components and hooks
- **TypeScript** for type safety and better developer experience
- **Vite** for fast development and optimized builds
- **Component-based** architecture for maintainability
- **Content Dialog Integration** - Advanced custom condition builder UI

---

## 🚀 Quick Start

### Prerequisites
- Node.js 22+ and Yarn
- A Beefree SDK account on a **Core plan or above** (required for Display Conditions)
- Display Conditions feature [enabled in your Beefree SDK Console](#1-enable-display-conditions-in-your-beefree-sdk-console)
- Beefree SDK credentials

### Option 1: Run from Repository Root (Recommended)

The easiest way to run this example is using the start command from the repository root:

```bash
# From the beefree-sdk-examples root directory
yarn start:conditional-rows
```

This single command will:
- ✅ Automatically install all dependencies
- ✅ Start the authentication server (port 3014)
- ✅ Start the conditional rows example (port 8014)

Then open your browser to `http://localhost:8014`

**Before running**, make sure to configure your Beefree SDK credentials in `conditional-rows-example/.env`:

```env
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here
PORT=3014
```

### Option 2: Run Manually (Advanced)

If you prefer to run the example independently, you need to manually start both the authentication server and the conditional rows example:

#### 1. Install Dependencies

```bash
cd conditional-rows-example
yarn install
```

#### 2. Configure Environment

Create a `conditional-rows-example/.env` file:

```bash
cp .env.example .env
```

Modify `conditional-rows-example/.env`:

```env
# Beefree SDK Credentials (Backend Only)
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here

# Server Configuration
PORT=3014
VITE_PORT=8014
```

#### 3. Start the Application

You can start both the backend server and frontend client with a single command:

```bash
yarn start
```

Or run them separately in different terminals:

```bash
# Terminal 1: Backend Server
yarn server:dev

# Terminal 2: Frontend Client
yarn dev
```

Open your browser to `http://localhost:8014`

---

## 🎮 Using the Demo

### Understanding Display Conditions

Display conditions allow you to create personalized email content that adapts based on recipient attributes. For example:
- Show VIP promotions only to premium customers
- Display region-specific content based on location
- Feature products from recipient's last browsed catalog
- Show re-engagement offers to inactive subscribers

### Two Ways to Add Conditions

#### Method 1: Browse & Select Pre-configured Conditions

1. **Select a Row** - Click on any row in the email editor
2. **Open Display Conditions** - Click the row settings (gear icon) → "Display Conditions" tab
3. **Browse by Category** - Choose from 5 categories or use the search bar
4. **Select a Condition** - Click on any of the 14 pre-configured conditions
5. **Apply** - The condition is instantly applied to the row

**Visual Indicator**: Rows with conditions show a bifurcation icon (🔀) on the structure tag.

#### Method 2: Build Custom Conditions (Advanced)

1. **Select a Row** - Click on any row in the email editor
2. **Open Display Conditions** - Click the row settings (gear icon) → "Display Conditions" tab
3. **Click "Build Custom Condition"** - Opens the visual condition builder modal
4. **Configure Your Condition**:
   - Enter a name and description
   - Select a field (e.g., "Customer Tier", "Cart Value")
   - Choose an operator (equals, greater than, less than, contains)
   - Enter a comparison value
   - Add more rules with AND logic if needed
5. **Preview** - See the generated Liquid syntax in real-time
6. **Apply Condition** - Click "Apply" to add it to your row

**Custom Indicator**: Edited conditions show a blue dot next to the condition name.

### Testing Conditions in Preview Mode

1. **Click Preview** - Use the preview button in the toolbar
2. **Toggle Display Conditions** - Use the switch to show/hide conditional content
3. **Simulate Recipients** - See what different audience segments will receive

### Editing and Removing Conditions

- **Change Condition**: Select a different pre-configured condition from the list
- **Edit Condition**: Click "Edit condition" to modify the syntax (becomes a custom condition)
- **Remove Condition**: Click the trash icon to remove the condition from the row

### Demo Header Actions

- **📋 View Available Conditions** - Opens a modal showing all 14 pre-configured conditions with descriptions and syntax
- **🔧 How to Build Custom Conditions** - Opens a guide explaining the custom condition builder feature
- **📚 Display Conditions Docs** - Links to official Beefree SDK documentation

---

## 🔧 Understanding the Configuration

### Display Conditions Configuration

Located in `src/config/clientConfig.ts`, the display conditions are configured in two parts:

#### 1. Row Display Conditions Array

An array of pre-configured conditions that users can browse and select:

```typescript
export const rowDisplayConditions: IRowDisplayCondition[] = [
  {
    type: 'Customer Segment',
    label: 'VIP Customers',
    description: 'Show content only to customers in the VIP loyalty tier',
    before: "{% if customer.loyaltyTier == 'VIP' %}",
    after: '{% endif %}'
  },
  {
    type: 'Geography',
    label: 'North America',
    description: 'Display content only for customers in North America region',
    before: "{% if customer.region == 'north_america' %}",
    after: '{% endif %}'
  }
  // ... 12 more conditions
]
```

**Key Properties**:
- `type`: Category for grouping (used in browse interface)
- `label`: User-friendly name shown in the selector
- `description`: Explains when this condition applies
- `before`: Opening syntax (e.g., `{% if ... %}`)
- `after`: Closing syntax (e.g., `{% endif %}`)

#### 2. Content Dialog for Custom Builder

The advanced feature that allows users to build conditions on-the-fly:

```typescript
contentDialog: {
  rowDisplayConditions: {
    label: 'Build Custom Condition',  // Button label in the UI
    handler: (resolve, reject, args) => {
      // Open custom modal
      openConditionBuilder({
        currentCondition: args?.condition,  // For editing existing
        onSave: (newCondition) => {
          resolve(newCondition)  // Return built condition
        },
        onCancel: () => {
          reject()  // User cancelled
        }
      })
    }
  }
}
```

**How It Works**:
1. User clicks "Build Custom Condition" button
2. Your custom UI modal opens (see `ConditionBuilderModal.tsx`)
3. User constructs condition visually
4. Modal calls `resolve()` with the condition object
5. Beefree SDK applies it to the selected row

### Basic SDK Configuration

```typescript
export const clientConfig: IBeeConfig = {
  uid: 'display-conditions-demo-user',
  container: 'bee-plugin-container',
  rowDisplayConditions: rowDisplayConditions,  // Pre-configured conditions
  contentDialog: {
    rowDisplayConditions: { /* custom builder config */ }
  }
}
```

### Authentication Flow

This example uses its own local server (`server.ts`) to handle credentials securely:

1. **Client** requests a token from `/auth/token`
2. **Server** validates and creates a signed JWT token
3. **Client** uses token to initialize Beefree SDK
4. **Beefree SDK** validates token with Beefree servers

**Why?** Your API credentials (Client ID and Secret) should NEVER be exposed in client-side code.

---

## 📚 How It Works - Key Integration Points

### 1. **Enable Display Conditions in Your Beefree SDK Console**

Before using this feature, you must enable it in your [Beefree SDK Console](https://developers.beefree.io/):

1. Log in to your Beefree developer account
2. Navigate to your application
3. Go to **Server-side configurations**
4. Find the **Display Conditions** option
5. Toggle it to **ON**
6. Save your changes

**Important Notes**:
- Display Conditions are **disabled by default**
- This feature requires a **paid plan** (Core subscription and above)
- Free and Essentials plans do not have access to this feature
- Check your current plan at [Beefree Developer Console](https://developers.beefree.io/pricing-plans)

### 2. **Configure Pre-configured Conditions**

Pass an array of conditions when initializing the SDK:

```typescript
const beeConfig: IBeeConfig = {
  // ... other config
  rowDisplayConditions: [
    {
      type: 'Customer Segment',        // Category for grouping
      label: 'VIP Customers',          // Display name
      description: 'For VIP tier only', // Explanation
      before: "{% if customer.tier == 'VIP' %}",  // Opening tag
      after: '{% endif %}'              // Closing tag
    }
  ]
}
```

**Language Agnostic**: Use any syntax your system supports:
- **Liquid**: `{% if ... %}` / `{% endif %}`
- **Handlebars**: `{{#if ...}}` / `{{/if}}`
- **Custom**: Your proprietary templating language

**See it in action:** Check `src/config/clientConfig.ts` for all 14 example conditions.

### 3. **Extend with Custom Condition Builder (Advanced)**

Allow users to create conditions on-the-fly using Content Dialog:

```typescript
contentDialog: {
  rowDisplayConditions: {
    label: 'Build Custom Condition',
    handler: (resolve, reject, args) => {
      // Open your custom UI
      showConditionBuilderModal({
        currentCondition: args?.condition,
        onSave: (condition) => {
          // User built a condition - return it
          resolve({
            type: 'BEE_CUSTOM_DISPLAY_CONDITION',
            label: condition.name,
            description: condition.description,
            before: condition.generatedBefore,
            after: condition.generatedAfter
          })
        },
        onCancel: () => reject()
      })
    }
  }
}
```

**What this enables**:
- Users aren't limited to pre-configured conditions
- Build conditions with your custom UI
- Generate templating syntax dynamically
- Full control over available fields and operators

**See it in action:** Click "Build Custom Condition" in the demo, check `src/components/ConditionBuilderModal.tsx`.

### 4. **User Permissions & Roles**

Control what users can do with display conditions:

```typescript
// View only - can see but not modify conditions
role: 'viewer'

// Can select from pre-configured conditions
permissions: {
  canSelectConditions: true,
  canEditConditions: false,
  canAddConditions: false
}

// Full control - can select, edit, and add conditions
permissions: {
  canSelectConditions: true,
  canEditConditions: true,
  canAddConditions: true
}
```

**Three permission levels**:
1. **View & Preview** - See conditions but can't modify (read-only)
2. **Select Only** - Choose from pre-configured conditions, no editing
3. **Full Control** - Select, edit existing, or add custom conditions

Configure these in your [Beefree SDK Console](https://developers.beefree.io/) under Role settings.

### 5. **Custom Conditions vs Pre-configured**

When a user edits a pre-configured condition, it becomes a **custom condition**:

**Visual Indicators**:
- 🔵 **Blue dot** appears next to the condition name
- ❌ "Change condition" button is replaced with trash icon
- ⚠️ Custom conditions can only be removed, not changed back

**Why this matters**:
- Custom conditions aren't saved to your configuration
- They exist only in the template JSON
- Users can't browse/search for custom conditions
- Each is unique to that specific row

### 6. **HTML Output Structure**

Beefree SDK isolates conditional syntax from row content:

```html
<!-- Before: Opening conditional tag -->
{% if customer.tier == 'VIP' %}

<!-- Row Content: Isolated and safe to manipulate -->
<table>
  <tr>
    <td>Your VIP exclusive content here</td>
  </tr>
</table>

<!-- After: Closing conditional tag -->
{% endif %}
```

**Benefits**:
- Your system can delete/repeat/modify row content independently
- Conditional tags remain intact
- Clean separation of concerns
- Easy to process in your email sending system

---

## 🎨 Customization

### Adding Your Own Conditions

Edit `src/config/clientConfig.ts` to add conditions that match your business logic:

```typescript
{
  type: 'Your Category',
  label: 'Your Condition Name',
  description: 'When this condition applies',
  before: '{% if your.field == "value" %}',
  after: '{% endif %}'
}
```

**Tips**:
- Group related conditions with the same `type`
- Write clear, user-friendly `description` text
- Use your email platform's templating syntax
- Test conditions in your sending system

### Customizing the Condition Builder

Modify `src/components/ConditionBuilderModal.tsx` to:
- Add more field options (customer attributes, product data, etc.)
- Support different operators (not equals, starts with, etc.)
- Change the generated syntax format
- Add validation rules
- Integrate with your data model

### Adapting to Your Templating Language

The syntax generation happens in `ConditionBuilderModal.tsx`:

```typescript
// Current: Liquid syntax
const before = `{% if ${field.value} ${operator.syntax} ${value} %}`
const after = `{% endif %}`

// Change to Handlebars
const before = `{{#if (${operator.fn} ${field.value} ${value})}}`
const after = `{{/if}}`

// Or your custom syntax
const before = `<condition field="${field.value}" op="${operator.id}" value="${value}">`
const after = `</condition>`
```

## 📦 Available Scripts

```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn preview      # Preview production build
yarn lint         # Run ESLint
yarn lint:fix     # Fix ESLint errors
yarn type-check   # Check TypeScript types
```

---

## 🐛 Troubleshooting

### Display Conditions Not Appearing
**Solution:** 
1. ✅ Verify you're on a **Core plan or above** (check at [developers.beefree.io](https://developers.beefree.io/pricing-plans))
2. ✅ Confirm Display Conditions are **enabled** in your [Beefree SDK Console](https://developers.beefree.io/) Server-side configurations
3. ✅ Check that `rowDisplayConditions` array is passed in your config
4. ✅ Verify user has permissions to view/use display conditions

### "Build Custom Condition" Button Not Working
**Solution:**
1. Check that `contentDialog.rowDisplayConditions` is configured
2. Verify the handler function is properly defined
3. Check browser console for JavaScript errors
4. Ensure modal state management is working (check `App.tsx`)

### Authentication Fails
**Solution:** Ensure the backend server is running on port 3014
```bash
yarn server:dev
```

### Conditions Not Showing in Preview Mode
**Solution:**
1. Make sure conditions are applied to rows (check for bifurcation icon 🔀)
2. Toggle "Display Conditions" ON in the Preview panel
3. Verify the conditional syntax is valid for your templating engine
4. Check that opening and closing tags match (`before` and `after`)

### Custom Conditions Lost After Reload
**Expected Behavior**: Custom conditions (edited from defaults) are saved in the template JSON, not in the configuration. They persist when you save/load the template but won't appear in the browseable condition list.

### Wrong Templating Syntax
**Solution:** The SDK doesn't validate syntax - it passes it through as-is. Make sure:
1. Your `before` and `after` tags match your email platform's syntax
2. Test exported HTML in your sending system
3. Adjust syntax in `clientConfig.ts` or the condition builder modal

---

## 🌟 Production Considerations

### Security
- **Server-side tokens only** - Never expose API credentials in client code
- **User validation** - Verify user identity before generating tokens
- **CORS configuration** - Properly configure cross-origin requests
- **Validate templating syntax** - Sanitize user-generated conditions to prevent injection attacks

### Condition Management
- **Centralize conditions** - Store your pre-configured conditions in a database or CMS
- **Version control** - Track changes to your condition library over time
- **A/B testing** - Test conditions with small segments before rolling out
- **Audit trail** - Log who creates/edits custom conditions
- **Documentation** - Provide internal docs explaining each condition's business logic

### Templating Integration
- **Test with your sending system** - Verify conditions work with your ESP/templating engine
- **Handle syntax errors** - Your sending system should gracefully handle invalid conditions
- **Preview testing** - Build preview functionality that matches your production rendering
- **Fallback content** - Consider what shows if a condition fails to evaluate

### User Experience
- **Permission management** - Use roles to prevent accidental condition edits
- **Training materials** - Teach marketers when to use each condition type
- **Naming conventions** - Establish clear naming standards for custom conditions
- **Condition limits** - Consider limiting complexity (e.g., max 3 rules per condition)

### Performance
- **Code splitting** - Vite automatically optimizes bundle size
- **Lazy loading** - Consider lazy-loading the Beefree SDK
- **Caching** - Cache templates and condition configurations
- **Bundle size** - Monitor SDK bundle impact on page load times

---

## 🔗 Related Resources

### Beefree SDK Documentation
- **[Display Conditions Documentation](https://docs.beefree.io/beefree-sdk/other-customizations/advanced-options/display-conditions)** - Official feature documentation
- **[Content Dialog Documentation](https://docs.beefree.io/beefree-sdk/other-customizations/advanced-options/content-dialog)** - Custom condition builder guide
- **[Advanced Permissions](https://docs.beefree.io/beefree-sdk/other-customizations/advanced-options/advanced-permissions)** - Role-based access control
- **[Server-side Configurations](https://docs.beefree.io/beefree-sdk/server-side-configurations/server-side-options)** - Enable/disable features

### External Resources
- **[Beefree SDK Console](https://developers.beefree.io/)** - Enable display conditions for your application
- **[Beefree Pricing](https://developers.beefree.io/pricing-plans)** - Check plan requirements
- **[React Documentation](https://react.dev/)** - React best practices
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - TypeScript guide
- **[Vite Documentation](https://vitejs.dev/)** - Vite configuration
- **[Liquid Template Language](https://shopify.github.io/liquid/)** - Liquid syntax reference

---

## 🤝 Contributing

When contributing to this example:

1. **Maintain type safety** - Use TypeScript types throughout
2. **Test both workflows** - Browse/select pre-configured + custom condition builder
3. **Update documentation** - Keep this README in sync with changes
4. **Follow conventions** - Match existing code style and patterns
5. **Test accessibility** - Ensure keyboard navigation and screen readers work
6. **Validate syntax** - Test conditions with actual templating engines

---

## 📄 License

This example is part of the Beefree SDK Examples repository.

---

## 💡 Tips & Best Practices

### Learning from This Example

**Configuration & Setup**:
- 📋 Study `src/config/clientConfig.ts` to see all 14 pre-configured conditions
- 🔍 Review `src/config/constants.ts` for condition categories and organization
- 🔧 Examine `ConditionBuilderModal.tsx` for custom builder implementation
- 🎨 Check `Header.tsx` and `Footer.tsx` for user education patterns

**Key Learning Points**:
- How to structure conditions with `type`, `label`, `description`, `before`, `after`
- Implementing Content Dialog handler for custom condition building
- Building a visual UI for condition creation
- Organizing conditions by categories
- Generating templating syntax dynamically

### Next Steps for Your Integration

#### Phase 1: Basic Setup
1. ✅ **Verify plan eligibility** - Ensure you're on Core plan or above
2. ✅ **Enable the feature** in Beefree SDK Console Server-side configurations
3. ✅ **Define your conditions** - Map your data model to condition logic
4. ✅ **Choose templating syntax** - Match your email sending platform

#### Phase 2: Configure Conditions
1. 📋 **Create condition library** - Build array of pre-configured conditions
2. 🏷️ **Categorize logically** - Group by business function (segment, behavior, etc.)
3. 📝 **Write clear descriptions** - Help users understand when to use each
4. 🧪 **Test with real data** - Validate conditions work in your sending system

#### Phase 3: Advanced Features (Optional)
1. 🔧 **Build custom UI** - Implement Content Dialog for on-the-fly condition creation
2. 🎨 **Design field selector** - Expose your data model as selectable fields
3. ⚙️ **Add operators** - Support relevant comparison operations
4. 📊 **Generate syntax** - Transform UI selections into templating code
5. ✅ **Validate inputs** - Prevent invalid conditions

#### Phase 4: User Management
1. 👥 **Configure roles** - Set permissions (view/select/edit/add)
2. 📚 **Create training docs** - Teach marketers about display conditions
3. 🎯 **Establish workflows** - When to use pre-configured vs custom
4. 📈 **Track usage** - Monitor which conditions are most valuable

### Real-World Use Cases

**E-commerce**:
- Show product recommendations based on browsing history
- Display cart recovery offers to users with abandoned carts
- Feature category-specific promotions

**SaaS**:
- Highlight features based on subscription tier
- Show onboarding content to new users only
- Display upgrade CTAs to free plan users

**Media/Publishing**:
- Personalize content based on reader interests
- Show regional news and events
- Target re-engagement offers to inactive subscribers

**B2B**:
- Customize messaging by company size or industry
- Show different content for leads vs customers
- Personalize by account health score

### For Production Applications

**Must Do**:
- ✅ Never expose API credentials in client code
- ✅ Test all conditions in your actual sending system
- ✅ Document each condition's purpose and expected behavior
- ✅ Implement proper user roles and permissions
- ✅ Provide fallback content if conditions fail
- ✅ Monitor condition performance and usage

**Should Do**:
- 📊 Add analytics to track condition usage
- 🎓 Build internal documentation for marketers
- 🧪 A/B test conditions before wide rollout
- 🔄 Regularly audit and clean up unused conditions
- 📋 Version control your condition library
- 💾 Back up templates with complex condition logic

**Nice to Have**:
- 🎨 Build a condition preview/simulator
- 📧 Implement condition-based email sending stats
- 🤖 Suggest conditions based on template content
- 📱 Mobile-friendly condition builder
- 🔔 Notify marketers when conditions might be outdated

---

## ❓ FAQ

**Q: Do I need to validate the conditional syntax?**  
A: No, Beefree SDK passes the syntax through as-is. Your email sending system handles validation and rendering.

**Q: Can I use this with Mailchimp/SendGrid/etc?**  
A: Yes! Use the merge tag syntax that your platform supports. The feature is language agnostic.

**Q: What happens if a condition is invalid?**  
A: Depends on your sending system. Most platforms either skip the content or send it to everyone. Test thoroughly!

**Q: Can users nest conditions?**  
A: Not through the UI. Users can manually edit to nest, but the visual tools support single-level conditions.

**Q: How many conditions should I provide?**  
A: Start with 10-20 covering your main use cases. Add more based on user feedback.

**Q: Can I change conditions after they're applied to templates?**  
A: Pre-configured conditions can be updated centrally. Custom (edited) conditions exist only in that template.

---

**Need help?** Check the [Beefree SDK documentation](https://docs.beefree.io/beefree-sdk/other-customizations/advanced-options/display-conditions) or [submit a support request](https://devportal.beefree.io/hc/en-us/requests/new).

**Found a bug?** Please report it in the [GitHub repository](https://github.com/BeefreeSDK/beefree-sdk-examples/issues).

**Want to see more examples?** Check out the other examples in this repository showcasing different Beefree SDK features!
