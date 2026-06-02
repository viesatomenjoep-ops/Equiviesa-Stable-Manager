# Equiviesa Stable Manager

All-in stable manager project ready for database-driven operations with Supabase and Cloudinary.

## Repository Contents

* `Equivesa.jsx`: Main React application component.
* `supabase_schema.sql`: Full database structure ready to be copied into the Supabase SQL editor.
* `cloudinary_migration.js`: Local Node.js migration script to bulk upload photos to Cloudinary and update references in Supabase.
* `.gitignore`: Basic configuration for Git ignore list.

## Getting Started

1. Set up a Supabase project and execute the SQL script in the Supabase SQL Editor.
2. Configure Cloudinary and set up unsigned upload presets.
3. Install project dependencies and configure the `.env` settings.
