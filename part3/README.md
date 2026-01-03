# Phonebook Backend

Backend para la aplicación Phonebook del curso Full Stack Open.

## Enlace de despliegue
[Ver aplicación desplegada](https://phonebook-backend-7mcg.onrender.com)

## Características
- CRUD completo para contactos telefónicos
- Validación de datos
- Logging con Morgan
- Frontend integrado (React)

## Endpoints
- `GET /api/persons` - Obtener todos los contactos
- `GET /api/persons/:id` - Obtener contacto específico
- `POST /api/persons` - Crear nuevo contacto
- `DELETE /api/persons/:id` - Eliminar contacto
- `GET /info` - Información de la agenda

## Validaciones
- **Nombre:** mínimo 3 caracteres, único
- **Teléfono:** formato XX-XXXXXX o XXX-XXXXXXX (mínimo 8 caracteres)

## Ejecutar localmente
```bash
npm install
npm run dev