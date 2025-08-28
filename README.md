# SengHong Store - E-commerce Website

A modern, responsive e-commerce website built with Next.js, featuring Google Sheets integration for easy product management and Telegram checkout functionality.

## Features

- 📱 Mobile-first responsive design
- 🛒 Shopping cart with multiple product options
- 📊 Google Sheets integration for product management
- 💬 Telegram checkout system
- 🎨 Professional animations and transitions
- 🔍 Product search and filtering
- 📦 Category-based product organization
- 🎯 Event-based discount management

## Google Sheets Integration Setup

### 1. Create Google Sheets Document

Create a new Google Sheets document with the following structure:

#### Products Sheet
| Column A | Column B | Column C | Column D | Column E | Column F | Column G | Column H | Column I | Column J |
|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
| id | name | category | price | discount | colors | sizes | image | description | eventId |
| 001 | Basic Cotton T-Shirt | shirts | 15.99 | 10 | Black,White,Blue | S,M,L,XL | /basic-cotton-t-shirt.png | Comfortable cotton t-shirt | summer-sale-2025 |

#### Events Sheet
| Column A | Column B | Column C | Column D | Column E | Column F |
|----------|----------|----------|----------|----------|----------|
| id | title | description | discountPercentage | startDate | endDate |
| summer-sale-2025 | Summer Sale | Up to 50% off summer collection | 30 | 2025-06-01 | 2025-08-31 |

#### Categories Sheet
| Column A | Column B | Column C |
|----------|----------|----------|
| id | name | description |
| shirts | Shirts | Casual and formal shirts |
| jeans | Jeans | Denim collection |

### 2. Google Sheets API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Sheets API
4. Create credentials (Service Account)
5. Download the JSON key file
6. Share your Google Sheet with the service account email

### 3. Environment Variables

Add these environment variables to your Vercel project:

\`\`\`env
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
GOOGLE_SHEETS_SPREADSHEET_ID="your-spreadsheet-id"
\`\`\`

### 4. Product Management

#### Adding New Products
1. Open your Google Sheets document
2. Add a new row in the Products sheet
3. Fill in all required columns:
   - **id**: Unique identifier (e.g., "001", "002")
   - **name**: Product name
   - **category**: Must match a category in Categories sheet
   - **price**: Numeric value (e.g., 29.99)
   - **discount**: Percentage discount (0-100)
   - **colors**: Comma-separated list (e.g., "Red,Blue,Green")
   - **sizes**: Comma-separated list (e.g., "S,M,L,XL")
   - **image**: Image path (e.g., "/product-image.png")
   - **description**: Product description
   - **eventId**: Link to event for discounts (optional)

#### Managing Events/Discounts
1. Add events in the Events sheet
2. Set start and end dates
3. Link products to events using the eventId column
4. Events will automatically appear on homepage when active

#### Managing Categories
1. Add categories in the Categories sheet
2. Use category IDs in the Products sheet
3. Categories will automatically appear in navigation

### 5. Image Management

Upload product images to the `/public` folder and reference them in the Google Sheets image column with the path starting with `/` (e.g., `/product-image.png`).

### 6. Telegram Integration

The checkout system generates formatted messages for Telegram. Users can choose between:
- **Delivery**: Requires delivery address and preferred time
- **Pickup**: Requires pickup time

Messages are automatically formatted and sent to the configured Telegram contact.

## Development

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
\`\`\`

## Deployment

Deploy to Vercel with the required environment variables configured in your project settings.

## Support

For technical support or questions about Google Sheets integration, please refer to the Google Sheets API documentation or contact the development team.
# senghongclothesshop
