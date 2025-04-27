# Node.js Backend API

A robust Node.js backend application built with Express, PostgreSQL, Sequelize, and RBAC (Role Based Access Control).

## Features

- **RESTful API** with Express
- **PostgreSQL** database with Sequelize ORM
- **RBAC (Role-Based Access Control)** for fine-grained permissions
- **JWT Authentication** for secure API access
- **Structured Architecture** with controllers, services, and models
- **Migration System** for database version control
- **Environment Specific Configuration**
- **API Documentation**

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- PostgreSQL (v13+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd my-backend-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your database credentials and other settings.

4. Create the database:
   ```bash
   npm run db:create
   ```

5. Run migrations:
   ```bash
   npm run db:migrate
   ```

6. Seed the database with initial data:
   ```bash
   npm run db:seed:all
   ```

### Running the Application

#### Development mode:
```bash
npm run dev
```

#### Production mode:
```bash
npm start
```

## Project Structure

```
my-backend-app/
├── app.js                  # Application entry point
├── package.json            # Project metadata and dependencies
├── .env                    # Environment variables
├── .env.example            # Environment variables example
├── .sequelizerc            # Sequelize CLI configuration
├── src/
│   ├── config/             # Configuration files
│   │   ├── app.js          # App configuration
│   │   ├── database.js     # Database configuration
│   │   └── db.js           # Database connection
│   ├── controllers/        # Request handlers
│   ├── database/           # Database related files
│   │   ├── migrations/     # Database migrations
│   │   └── seeders/        # Database seeders
│   ├── middlewares/        # Express middlewares
│   ├── models/             # Sequelize models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   └── utils/              # Utility functions
```

## API Endpoints

### Authentication

- **POST /api/auth/register** - Register a new user
- **POST /api/auth/login** - Login user and get token
- **GET /api/auth/profile** - Get current user profile

### Users

- **GET /api/users** - Get all users
- **GET /api/users/:id** - Get user by ID
- **PUT /api/users/:id** - Update user
- **DELETE /api/users/:id** - Delete user

### Roles

- **GET /api/roles** - Get all roles
- **GET /api/roles/:id** - Get role by ID
- **POST /api/roles** - Create new role
- **PUT /api/roles/:id** - Update role
- **DELETE /api/roles/:id** - Delete role

### Permissions

- **GET /api/permissions** - Get all permissions
- **GET /api/permissions/:id** - Get permission by ID
- **POST /api/permissions** - Create new permission
- **PUT /api/permissions/:id** - Update permission
- **DELETE /api/permissions/:id** - Delete permission

### Health Check

- **GET /api/ping** - Check API and database health

## Database Schema

### Users (database_users)
- `id` - UUID primary key
- `username` - Unique username
- `password` - Hashed password
- `firstname` - First name
- `lastname` - Last name
- `email` - Email address
- `mobile` - Mobile number (optional)
- `createdAt` - Creation timestamp
- `updatedAt` - Update timestamp

### Roles (database_roles)
- `id` - UUID primary key
- `role_name` - Role name
- `role_desc` - Role description
- `created_at` - Creation timestamp
- `updated_at` - Update timestamp

### Permissions (database_permissions)
- `id` - UUID primary key
- `perm_name` - Permission name
- `perm_desc` - Permission description
- `parent_id` - Parent permission (hierarchical)
- `created_at` - Creation timestamp
- `updated_at` - Update timestamp

### Role Permissions (database_roles_permissions)
- `id` - UUID primary key
- `role_id` - Role ID (foreign key)
- `perm_id` - Permission ID (foreign key)
- `created_at` - Creation timestamp
- `updated_at` - Update timestamp

### User Roles (UserRoles)
- `id` - UUID primary key
- `userId` - User ID (foreign key)
- `roleId` - Role ID (foreign key)
- `createdAt` - Creation timestamp
- `updatedAt` - Update timestamp

## RBAC Setup

The application comes with a pre-configured RBAC system with three default roles:

1. **Admin** - Full access to all features
2. **Manager** - Can manage users and view roles
3. **User** - Basic access with only user read permissions

Default admin credentials:
- Username: `admin`
- Password: `admin123`

## Development

### Creating Migrations

```bash
npm run migration:generate -- --name create-new-table
```

### Creating Models

```bash
npm run model:generate -- --name NewModel --attributes field1:string,field2:integer
```

### Creating Seeders

```bash
npm run seed:generate -- --name seed-data
```

## Production Deployment

1. Set proper environment variables for production
2. Build the application (if needed)
3. Run migrations
4. Run the application with a process manager like PM2

```bash
NODE_ENV=production npm start
```

## License

This project is licensed under the MIT License.
