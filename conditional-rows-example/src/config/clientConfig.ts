import type { IBeeConfig } from '@beefree.io/sdk/dist/types/bee'
import { DEFAULT_UID, DEFAULT_CONTAINER } from './constants'

// Pre-configured display conditions that will be available in the editor
// Users can select these conditions to show/hide rows based on recipient attributes
export const rowDisplayConditions = [
  {
    type: 'Customer Segment',
    label: 'Premium Customers',
    description: 'Show this content only to premium tier customers',
    before: '{% if customer.tier == "premium" %}',
    after: '{% endif %}',
  },
  {
    type: 'Customer Segment',
    label: 'Standard Customers',
    description: 'Show this content only to standard tier customers',
    before: '{% if customer.tier == "standard" %}',
    after: '{% endif %}',
  },
  {
    type: 'Customer Segment',
    label: 'Free Trial Users',
    description: 'Show this content only to users on free trial',
    before: '{% if customer.tier == "trial" %}',
    after: '{% endif %}',
  },
  {
    type: 'Geographic Location',
    label: 'North America',
    description: 'Display for recipients in North America',
    before: '{% if customer.region == "north_america" %}',
    after: '{% endif %}',
  },
  {
    type: 'Geographic Location',
    label: 'Europe',
    description: 'Display for recipients in Europe',
    before: '{% if customer.region == "europe" %}',
    after: '{% endif %}',
  },
  {
    type: 'Geographic Location',
    label: 'Asia Pacific',
    description: 'Display for recipients in Asia Pacific',
    before: '{% if customer.region == "asia_pacific" %}',
    after: '{% endif %}',
  },
  {
    type: 'Shopping Behavior',
    label: 'Recent Purchasers',
    description: 'Show to customers who made a purchase in the last 30 days',
    before: '{% if customer.lastPurchaseDays <= 30 %}',
    after: '{% endif %}',
  },
  {
    type: 'Shopping Behavior',
    label: 'Cart Abandoners',
    description: 'Show to customers with items in cart but no recent purchase',
    before: '{% if customer.hasCartItems and customer.lastPurchaseDays > 30 %}',
    after: '{% endif %}',
  },
  {
    type: 'Shopping Behavior',
    label: 'High-Value Customers',
    description: 'Show to customers with lifetime value over $1000',
    before: '{% if customer.lifetimeValue > 1000 %}',
    after: '{% endif %}',
  },
  {
    type: 'Product Catalog',
    label: 'Women\'s Catalog',
    description: 'Only people whose last ordered item is from Women\'s catalog',
    before: '{% if lastOrder.catalog == "Women" %}',
    after: '{% endif %}',
  },
  {
    type: 'Product Catalog',
    label: 'Men\'s Catalog',
    description: 'Only people whose last ordered item is from Men\'s catalog',
    before: '{% if lastOrder.catalog == "Men" %}',
    after: '{% endif %}',
  },
  {
    type: 'Product Catalog',
    label: 'Children\'s Catalog',
    description: 'Only people whose last ordered item is from Children\'s catalog',
    before: '{% if lastOrder.catalog == "Children" %}',
    after: '{% endif %}',
  },
  {
    type: 'Engagement Level',
    label: 'Active Subscribers',
    description: 'Show to subscribers who opened at least one email in the last 90 days',
    before: '{% if subscriber.lastOpenDays <= 90 %}',
    after: '{% endif %}',
  },
  {
    type: 'Engagement Level',
    label: 'Inactive Subscribers',
    description: 'Show to subscribers who haven\'t opened emails in 90+ days',
    before: '{% if subscriber.lastOpenDays > 90 %}',
    after: '{% endif %}',
  },
]

export const clientConfig: IBeeConfig = {
  container: DEFAULT_CONTAINER,
  uid: DEFAULT_UID,
  rowDisplayConditions,
}
