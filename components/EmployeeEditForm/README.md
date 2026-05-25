# Employee Edit Form - Next.js with Prisma

A complete employee editing form implementation using Next.js 15, Prisma, shadcn/ui, Zod validation, and `useActionState`.

## Features

- ✅ Full form validation with Zod
- ✅ Server Actions with `useActionState`
- ✅ Organized tabs (Personal, ID, Employment, Contact)
- ✅ Unique constraint validation (idCardPin, cardId)
- ✅ Real-time form submission feedback
- ✅ Responsive design with Tailwind CSS
- ✅ Type-safe with TypeScript
- ✅ shadcn/ui components

## File Structure

```
app/
├── employees/
│   └── [id]/
│       ├── edit/
│       │   └── page.tsx                 # Main page component
│       ├── employee-edit-form.tsx       # Form component
│       ├── update-employee-action.ts    # Server action
│       └── employee-form-schema.ts      # Zod schema
```

## Installation Steps

### 1. Install Required Dependencies

```bash
npm install zod
npm install @hookform/resolvers
```

### 2. Install shadcn/ui Components

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add select
npx shadcn@latest add card
npx shadcn@latest add tabs
npx shadcn@latest add switch
npx shadcn@latest add alert
```

### 3. Update Your Prisma Schema

Make sure your Prisma schema matches the enums used in the form:

```prisma
enum IdCardSerie {
  AZE
  AA
  MYX
}

enum Nationality {
  Azerbaijan
  Turkey
  Russia
  Other
}

enum Sex {
  Male
  Female
}

enum BloodType {
  A_POSITIVE
  A_NEGATIVE
  B_POSITIVE
  B_NEGATIVE
  AB_POSITIVE
  AB_NEGATIVE
  O_POSITIVE
  O_NEGATIVE
}

enum Shift {
  Day
  Night
  Rotating
}

model Employee {
  id          String      @id @default(uuid())
  firstName   String?
  middleName  String?
  patronymic  String?
  lastName    String?
  fullName    String?
  idCardSerie IdCardSerie?
  idCardNo    String?
  idCardPin   String?     @unique
  nationality Nationality?
  sex         Sex?
  birthDate   DateTime?
  bloodType   BloodType?
  phoneNumber String?
  emergencyPhoneNumber String?
  shift       Shift?
  hireDate    DateTime?
  terminationDate DateTime?
  cardId      String @unique
  image       String?
  companyId   String
  company     Company @relation(fields: [companyId], references: [id])
  departmentId String
  department  Department @relation(fields: [departmentId], references: [id])
  positionId  String
  position    Position @relation(fields: [positionId], references: [id])
  isActive    Boolean? @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  checkins    Checkin[]

  @@map("employee")
}
```

### 4. Set Up Prisma Client

Create a Prisma client instance if you haven't already:

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### 5. File Placement

Place the files in your Next.js app directory:

1. **employee-form-schema.ts** → `app/employees/[id]/edit/employee-form-schema.ts`
2. **update-employee-action.ts** → `app/employees/[id]/edit/update-employee-action.ts`
3. **employee-edit-form.tsx** → `app/employees/[id]/edit/employee-edit-form.tsx`
4. **page.tsx** → `app/employees/[id]/edit/page.tsx`

### 6. Update Import Paths

Adjust the import paths based on your project structure:

- `@/lib/prisma` → Your Prisma client location
- `@/components/ui/*` → Your shadcn components location

## Usage

Navigate to `/employees/{employee-id}/edit` to edit an employee.

Example:
```
http://localhost:3000/employees/550e8400-e29b-41d4-a716-446655440000/edit
```

## Form Sections

### Personal Information Tab
- First Name (required)
- Last Name (required)
- Middle Name
- Patronymic
- Full Name
- Sex
- Birth Date
- Nationality
- Blood Type

### Identification Tab
- ID Card Serie (AZE/AA/MYX)
- ID Card Number
- ID Card PIN (unique, uppercase + numbers)
- Card ID (required, unique)

### Employment Tab
- Department (required)
- Position (required)
- Shift (Day/Night/Rotating)
- Hire Date
- Termination Date
- Active Status (switch)

### Contact Tab
- Phone Number
- Emergency Phone Number
- Profile Image URL

## Validation Rules

- **First Name & Last Name**: Required
- **ID Card PIN**: 7-20 characters, uppercase letters and numbers only, unique
- **Card ID**: Required, unique across all employees
- **Phone Numbers**: Optional, validated format
- **Dates**: Proper date format validation
- **Department & Position**: Required selections

## Error Handling

The form provides:
- Field-level validation errors
- Unique constraint violation feedback
- Success/failure alerts
- Loading states during submission

## Customization

### Adding New Fields

1. Update the Prisma schema
2. Add field to `employeeFormSchema` in `employee-form-schema.ts`
3. Update server action to handle the field
4. Add input component to the form

### Changing Validation Rules

Edit the Zod schema in `employee-form-schema.ts`:

```typescript
phoneNumber: z.string()
  .min(10, "Phone must be at least 10 digits")
  .regex(/^\+994/, "Must start with +994")
  .optional()
```

### Styling

The form uses Tailwind CSS and shadcn/ui. Customize by:
- Modifying className props
- Updating shadcn component themes
- Adjusting grid layouts

## Server Action Flow

1. User submits form
2. FormData extracted and validated with Zod
3. Unique constraints checked in database
4. Employee record updated
5. Relevant pages revalidated
6. Success/error state returned to form

## TypeScript Support

All components are fully typed:
- Form values typed with Zod inference
- Prisma types for database operations
- Props interfaces for components

## Testing Checklist

- [ ] Create new employee works
- [ ] All fields save correctly
- [ ] Validation errors display properly
- [ ] Unique constraints enforced (PIN, Card ID)
- [ ] Date fields format correctly
- [ ] Department/Position dropdowns populate
- [ ] Active status toggle works
- [ ] Success message shows after update
- [ ] Page revalidation works

## Notes

- The `isActive` switch requires special handling for form submission
- Dates are converted between ISO strings and Date objects
- The form uses controlled components with `defaultValue`
- Server actions run on the server and return serializable data

## License

MIT
