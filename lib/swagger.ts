import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = () => {
  return createSwaggerSpec({
    apiFolder: 'app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Pčelarstvo API',
        version: '1.0.0',
        description: 'REST API za upravljanje košnicama, aktivnostima i pčelarskim operacijama.',
      },
      tags: [
        { name: 'Autentifikacija', description: 'Registracija, prijava i odjava korisnika' },
        { name: 'Profil', description: 'Ažuriranje profila prijavljenog korisnika' },
        { name: 'Košnice', description: 'CRUD operacije nad košnicama' },
        { name: 'Aktivnosti', description: 'CRUD operacije nad aktivnostima' },
        { name: 'Komentari', description: 'Dodavanje i brisanje komentara na košnicama' },
        { name: 'Notifikacije', description: 'Slanje i pregled notifikacija' },
        { name: 'Vreme', description: 'Vremenska prognoza za lokaciju košnice' },
        { name: 'Admin', description: 'Administracija korisnika (samo ADMIN)' },
      ],
      paths: {
        '/api/auth/login': {
          post: {
            summary: 'Prijava korisnika',
            tags: ['Autentifikacija'],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['email', 'sifra'],
                    properties: {
                      email: { type: 'string', format: 'email', example: 'korisnik@example.com' },
                      sifra: { type: 'string', example: 'mojalozinka123' },
                    },
                  },
                },
              },
            },
            responses: {
              200: {
                description: 'Uspešna prijava',
                content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' }, token: { type: 'string' }, korisnik: { $ref: '#/components/schemas/KorisnikJavni' } } } } },
              },
              400: { description: 'Email ili lozinka nisu uneti', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
              401: { description: 'Pogrešan email ili lozinka', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
              500: { $ref: '#/components/responses/ServerError' },
            },
          },
        },
        '/api/auth/register': {
          post: {
            summary: 'Registracija novog korisnika',
            tags: ['Autentifikacija'],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['ime', 'email', 'sifra'],
                    properties: {
                      ime: { type: 'string', example: 'Marko Marković' },
                      email: { type: 'string', format: 'email', example: 'marko@example.com' },
                      sifra: { type: 'string', minLength: 6, example: 'mojalozinka123' },
                      uloga: { type: 'string', enum: ['KORISNIK', 'MENADZER', 'ADMIN'], default: 'KORISNIK' },
                    },
                  },
                },
              },
            },
            responses: {
              201: { description: 'Korisnik uspešno registrovan', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' }, korisnik: { $ref: '#/components/schemas/KorisnikJavni' } } } } } },
              400: { description: 'Nevalidni podaci', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
              409: { description: 'Korisnik već postoji', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
              500: { $ref: '#/components/responses/ServerError' },
            },
          },
        },
        '/api/auth/logout': {
          post: {
            summary: 'Odjava korisnika',
            tags: ['Autentifikacija'],
            security: [{ cookieAuth: [] }],
            responses: {
              200: { description: 'Uspešna odjava', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } },
              500: { $ref: '#/components/responses/ServerError' },
            },
          },
        },
        '/api/auth/me': {
          get: {
            summary: 'Preuzmi podatke o prijavljenom korisniku',
            tags: ['Autentifikacija'],
            security: [{ cookieAuth: [] }],
            responses: {
              200: { description: 'Podaci o korisniku', content: { 'application/json': { schema: { type: 'object', properties: { data: { $ref: '#/components/schemas/KorisnikJavni' } } } } } },
              401: { $ref: '#/components/responses/Unauthorized' },
            },
          },
        },
        '/api/auth/profile': {
          patch: {
            summary: 'Ažuriraj profil prijavljenog korisnika',
            tags: ['Profil'],
            security: [{ cookieAuth: [] }],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      pol: { type: 'boolean', example: true },
                      trenutnaSifra: { type: 'string', example: 'staraSifra123' },
                      novaSifra: { type: 'string', minLength: 6, example: 'novaSifra456' },
                    },
                  },
                },
              },
            },
            responses: {
              200: { description: 'Profil uspešno ažuriran', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' }, data: { $ref: '#/components/schemas/KorisnikJavni' } } } } } },
              400: { description: 'Nevalidni podaci', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
              401: { $ref: '#/components/responses/Unauthorized' },
              404: { $ref: '#/components/responses/NotFound' },
              500: { $ref: '#/components/responses/ServerError' },
            },
          },
        },
        '/api/hives': {
          get: {
            summary: 'Preuzmi sve košnice trenutnog korisnika',
            tags: ['Košnice'],
            security: [{ cookieAuth: [] }],
            responses: {
              200: { description: 'Lista košnica', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' }, data: { type: 'array', items: { $ref: '#/components/schemas/Kosnica' } } } } } } },
              401: { $ref: '#/components/responses/Unauthorized' },
              500: { $ref: '#/components/responses/ServerError' },
            },
          },
          post: {
            summary: 'Kreiraj novu košnicu',
            tags: ['Košnice'],
            security: [{ cookieAuth: [] }],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['naziv', 'brPcela', 'jacina', 'brRamova'],
                    properties: {
                      naziv: { type: 'string', example: 'Košnica Alpha' },
                      brPcela: { type: 'integer', example: 5000 },
                      jacina: { type: 'string', enum: ['SLABA', 'SREDNJA', 'JAKA'], example: 'JAKA' },
                      brRamova: { type: 'integer', example: 10 },
                      latitude: { type: 'number', example: 44.0165 },
                      longitude: { type: 'number', example: 21.0059 },
                    },
                  },
                },
              },
            },
            responses: {
              201: { description: 'Košnica kreirana', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' }, data: { $ref: '#/components/schemas/Kosnica' } } } } } },
              400: { description: 'Nevalidni podaci', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
              401: { $ref: '#/components/responses/Unauthorized' },
              500: { $ref: '#/components/responses/ServerError' },
            },
          },
        },
        '/api/hives/{id}': {
          get: {
            summary: 'Preuzmi jednu košnicu po ID-u',
            tags: ['Košnice'],
            security: [{ cookieAuth: [] }],
            parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' }, description: 'ID košnice' }],
            responses: {
              200: { description: 'Košnica preuzeta', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' }, data: { $ref: '#/components/schemas/KosnicaDetalji' } } } } } },
              401: { $ref: '#/components/responses/Unauthorized' },
              404: { $ref: '#/components/responses/NotFound' },
              500: { $ref: '#/components/responses/ServerError' },
            },
          },
          put: {
            summary: 'Izmeni košnicu',
            tags: ['Košnice'],
            security: [{ cookieAuth: [] }],
            parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      naziv: { type: 'string' },
                      brPcela: { type: 'integer' },
                      jacina: { type: 'string', enum: ['SLABA', 'SREDNJA', 'JAKA'] },
                      brRamova: { type: 'integer' },
                      latitude: { type: 'number' },
                      longitude: { type: 'number' },
                    },
                  },
                },
              },
            },
            responses: {
              200: { description: 'Košnica ažurirana', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' }, data: { $ref: '#/components/schemas/Kosnica' } } } } } },
              401: { $ref: '#/components/responses/Unauthorized' },
              404: { $ref: '#/components/responses/NotFound' },
              500: { $ref: '#/components/responses/ServerError' },
            },
          },
          delete: {
            summary: 'Obriši košnicu',
            tags: ['Košnice'],
            security: [{ cookieAuth: [] }],
            parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
            responses: {
              200: { description: 'Košnica obrisana', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } },
              401: { $ref: '#/components/responses/Unauthorized' },
              404: { $ref: '#/components/responses/NotFound' },
              500: { $ref: '#/components/responses/ServerError' },
            },
          },
        },
        '/api/hives/{id}/comments': {
          get: {
            summary: 'Preuzmi sve komentare za košnicu',
            tags: ['Komentari'],
            security: [{ cookieAuth: [] }],
            parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' }, description: 'ID košnice' }],
            responses: {
              200: { description: 'Lista komentara', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' }, data: { type: 'array', items: { $ref: '#/components/schemas/Komentar' } } } } } } },
              401: { $ref: '#/components/responses/Unauthorized' },
              404: { $ref: '#/components/responses/NotFound' },
              500: { $ref: '#/components/responses/ServerError' },
            },
          },
        },
        '/api/activities': {
          get: {
            summary: 'Preuzmi sve aktivnosti korisnika',
            tags: ['Aktivnosti'],
            security: [{ cookieAuth: [] }],
            responses: {
              200: { description: 'Lista aktivnosti', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' }, data: { type: 'array', items: { $ref: '#/components/schemas/Aktivnost' } } } } } } },
              401: { $ref: '#/components/responses/Unauthorized' },
              500: { $ref: '#/components/responses/ServerError' },
            },
          },
          post: {
            summary: 'Kreiraj novu aktivnost',
            tags: ['Aktivnosti'],
            security: [{ cookieAuth: [] }],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['naslov', 'tip', 'opis', 'datumPocetka', 'kosnicaId'],
                    properties: {
                      naslov: { type: 'string', example: 'Pregled proleće' },
                      tip: { type: 'string', example: 'PREGLED' },
                      opis: { type: 'string', example: 'Redovni prolećni pregled košnice' },
                      datumPocetka: { type: 'string', format: 'date-time', example: '2026-04-15T10:00:00Z' },
                      kosnicaId: { type: 'integer', example: 1 },
                    },
                  },
                },
              },
            },
            responses: {
              201: { description: 'Aktivnost kreirana', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' }, data: { $ref: '#/components/schemas/Aktivnost' } } } } } },
              400: { description: 'Nevalidni podaci', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
              401: { $ref: '#/components/responses/Unauthorized' },
              404: { description: 'Košnica nije pronađena', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
              500: { $ref: '#/components/responses/ServerError' },
            },
          },
        },
        '/api/activities/{id}': {
          get: {
            summary: 'Preuzmi jednu aktivnost po ID-u',
            tags: ['Aktivnosti'],
            security: [{ cookieAuth: [] }],
            parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
            responses: {
              200: { description: 'Aktivnost preuzeta', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' }, data: { $ref: '#/components/schemas/Aktivnost' } } } } } },
              401: { $ref: '#/components/responses/Unauthorized' },
              404: { $ref: '#/components/responses/NotFound' },
              500: { $ref: '#/components/responses/ServerError' },
            },
          },
          put: {
            summary: 'Izmeni aktivnost',
            tags: ['Aktivnosti'],
            security: [{ cookieAuth: [] }],
            parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['naslov', 'tip', 'opis', 'datumPocetka'],
                    properties: {
                      naslov: { type: 'string' },
                      tip: { type: 'string' },
                      opis: { type: 'string' },
                      datumPocetka: { type: 'string', format: 'date-time' },
                      izvrsena: { type: 'boolean' },
                    },
                  },
                },
              },
            },
            responses: {
              200: { description: 'Aktivnost ažurirana', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' }, aktivnost: { $ref: '#/components/schemas/Aktivnost' } } } } } },
              400: { description: 'Nevalidni podaci', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
              401: { $ref: '#/components/responses/Unauthorized' },
              500: { $ref: '#/components/responses/ServerError' },
            },
          },
          delete: {
            summary: 'Obriši aktivnost',
            tags: ['Aktivnosti'],
            security: [{ cookieAuth: [] }],
            parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
            responses: {
              200: { description: 'Aktivnost obrisana', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } },
              401: { $ref: '#/components/responses/Unauthorized' },
              500: { $ref: '#/components/responses/ServerError' },
            },
          },
        },
        '/api/comments': {
          post: {
            summary: 'Dodaj komentar na košnicu',
            tags: ['Komentari'],
            security: [{ cookieAuth: [] }],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['sadrzaj', 'kosnicaId'],
                    properties: {
                      sadrzaj: { type: 'string', example: 'Košnica je u odličnom stanju.' },
                      kosnicaId: { type: 'integer', example: 1 },
                    },
                  },
                },
              },
            },
            responses: {
              201: { description: 'Komentar dodat', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' }, data: { $ref: '#/components/schemas/Komentar' } } } } } },
              400: { description: 'Nevalidni podaci', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
              401: { $ref: '#/components/responses/Unauthorized' },
              404: { $ref: '#/components/responses/NotFound' },
              500: { $ref: '#/components/responses/ServerError' },
            },
          },
        },
        '/api/comments/{id}': {
          delete: {
            summary: 'Obriši komentar',
            tags: ['Komentari'],
            security: [{ cookieAuth: [] }],
            parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' }, description: 'ID komentara' }],
            responses: {
              200: { description: 'Komentar obrisan', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } },
              401: { $ref: '#/components/responses/Unauthorized' },
              404: { description: 'Komentar nije pronađen', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
              500: { $ref: '#/components/responses/ServerError' },
            },
          },
        },
        '/api/notifications': {
          get: {
            summary: 'Preuzmi sve notifikacije korisnika',
            tags: ['Notifikacije'],
            security: [{ cookieAuth: [] }],
            responses: {
              200: { description: 'Lista notifikacija', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/Notifikacija' } } } } } } },
              401: { $ref: '#/components/responses/Unauthorized' },
              500: { $ref: '#/components/responses/ServerError' },
            },
          },
          post: {
            summary: 'Pošalji notifikaciju svim korisnicima (samo MENADZER)',
            tags: ['Notifikacije'],
            security: [{ cookieAuth: [] }],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['poruka'],
                    properties: {
                      poruka: { type: 'string', maxLength: 500, example: 'Sezona berbe meda počinje.' },
                    },
                  },
                },
              },
            },
            responses: {
              201: { description: 'Notifikacija poslata', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } },
              400: { description: 'Nevalidni podaci', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
              401: { $ref: '#/components/responses/Unauthorized' },
              403: { description: 'Nemate dozvolu', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
              500: { $ref: '#/components/responses/ServerError' },
            },
          },
          patch: {
            summary: 'Označi notifikaciju kao pročitanu',
            tags: ['Notifikacije'],
            security: [{ cookieAuth: [] }],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['id'],
                    properties: {
                      id: { type: 'integer', example: 3 },
                    },
                  },
                },
              },
            },
            responses: {
              200: { description: 'Notifikacija označena kao pročitana', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } },
              401: { $ref: '#/components/responses/Unauthorized' },
              500: { $ref: '#/components/responses/ServerError' },
            },
          },
        },
        '/api/weather': {
          get: {
            summary: 'Preuzmi vremensku prognozu za lokaciju košnice',
            tags: ['Vreme'],
            parameters: [
              { in: 'query', name: 'lat', required: true, schema: { type: 'number' }, example: 44.0165 },
              { in: 'query', name: 'lon', required: true, schema: { type: 'number' }, example: 21.0059 },
            ],
            responses: {
              200: { description: 'Podaci o vremenu', content: { 'application/json': { schema: { type: 'object', properties: { current_weather: { type: 'object', properties: { temperature: { type: 'number' }, windspeed: { type: 'number' }, weathercode: { type: 'integer' } } } } } } } },
              400: { description: 'Nedostaju koordinate', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            },
          },
        },
        '/api/admin/users': {
          get: {
            summary: 'Preuzmi listu svih korisnika (samo ADMIN)',
            tags: ['Admin'],
            security: [{ cookieAuth: [] }],
            responses: {
              200: {
                description: 'Lista korisnika',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'array',
                          items: {
                            allOf: [
                              { $ref: '#/components/schemas/KorisnikJavni' },
                              { type: 'object', properties: { _count: { type: 'object', properties: { kosnice: { type: 'integer' }, aktivnosti: { type: 'integer' } } } } },
                            ],
                          },
                        },
                      },
                    },
                  },
                },
              },
              403: { description: 'Nemate dozvolu', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
              500: { $ref: '#/components/responses/ServerError' },
            },
          },
          patch: {
            summary: 'Izmeni ulogu ili lozinku korisnika (samo ADMIN)',
            tags: ['Admin'],
            security: [{ cookieAuth: [] }],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['id'],
                    properties: {
                      id: { type: 'integer', example: 2 },
                      uloga: { type: 'string', enum: ['KORISNIK', 'MENADZER'], example: 'MENADZER' },
                      novaSifra: { type: 'string', minLength: 6, example: 'novaLozinka123' },
                    },
                  },
                },
              },
            },
            responses: {
              200: { description: 'Korisnik ažuriran', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' }, data: { $ref: '#/components/schemas/KorisnikJavni' } } } } } },
              400: { description: 'Nevalidni podaci', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
              403: { description: 'Nemate dozvolu', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
              404: { $ref: '#/components/responses/NotFound' },
              500: { $ref: '#/components/responses/ServerError' },
            },
          },
          delete: {
            summary: 'Obriši korisnika (samo ADMIN)',
            tags: ['Admin'],
            security: [{ cookieAuth: [] }],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['id'],
                    properties: {
                      id: { type: 'integer', example: 2 },
                    },
                  },
                },
              },
            },
            responses: {
              200: { description: 'Korisnik obrisan', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } },
              400: { description: 'Nevalidni podaci', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
              403: { description: 'Nemate dozvolu', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
              404: { $ref: '#/components/responses/NotFound' },
              500: { $ref: '#/components/responses/ServerError' },
            },
          },
        },
      },
      components: {
        securitySchemes: {
          cookieAuth: {
            type: 'apiKey',
            in: 'cookie',
            name: 'token',
            description: 'JWT token koji se postavlja nakon prijave',
          },
        },
        schemas: {
          Error: {
            type: 'object',
            properties: {
              error: { type: 'string', example: 'Greška na serveru.' },
            },
          },
          KorisnikJavni: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              ime: { type: 'string', example: 'Marko Marković' },
              email: { type: 'string', example: 'marko@example.com' },
              uloga: { type: 'string', enum: ['KORISNIK', 'MENADZER', 'ADMIN'], example: 'KORISNIK' },
              pol: { type: 'boolean', nullable: true, example: true },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
          Kosnica: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              naziv: { type: 'string', example: 'Košnica Alpha' },
              brPcela: { type: 'integer', example: 5000 },
              jacina: { type: 'string', enum: ['SLABA', 'SREDNJA', 'JAKA'], example: 'JAKA' },
              brRamova: { type: 'integer', example: 10 },
              korisnikId: { type: 'integer', example: 1 },
              latitude: { type: 'number', nullable: true, example: 44.0165 },
              longitude: { type: 'number', nullable: true, example: 21.0059 },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
          KosnicaDetalji: {
            allOf: [
              { $ref: '#/components/schemas/Kosnica' },
              { type: 'object', properties: { aktivnosti: { type: 'array', items: { $ref: '#/components/schemas/Aktivnost' } } } },
            ],
          },
          Aktivnost: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              naslov: { type: 'string', example: 'Pregled proleće' },
              tip: { type: 'string', example: 'PREGLED' },
              opis: { type: 'string', example: 'Redovni prolećni pregled.' },
              datumPocetka: { type: 'string', format: 'date-time' },
              izvrsena: { type: 'boolean', example: false },
              korisnikId: { type: 'integer', example: 1 },
              kosnicaId: { type: 'integer', example: 1 },
              kosnica: { type: 'object', nullable: true, properties: { naziv: { type: 'string', example: 'Košnica Alpha' } } },
            },
          },
          Komentar: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              sadrzaj: { type: 'string', example: 'Košnica je u odličnom stanju.' },
              jacinaKosnice: { type: 'string', enum: ['SLABA', 'SREDNJA', 'JAKA'], example: 'JAKA' },
              korisnikId: { type: 'integer', example: 1 },
              kosnicaId: { type: 'integer', example: 1 },
              createdAt: { type: 'string', format: 'date-time' },
              korisnik: { type: 'object', properties: { ime: { type: 'string', example: 'Marko' }, email: { type: 'string', example: 'marko@example.com' } } },
            },
          },
          Notifikacija: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              poruka: { type: 'string', example: 'Sezona berbe meda počinje.' },
              seen: { type: 'boolean', example: false },
              korisnikId: { type: 'integer', example: 1 },
              aktivnostId: { type: 'integer', nullable: true, example: null },
              createdAt: { type: 'string', format: 'date-time' },
              aktivnost: { nullable: true, type: 'object', properties: { naslov: { type: 'string' }, tip: { type: 'string' }, datumPocetka: { type: 'string', format: 'date-time' } } },
            },
          },
        },
        responses: {
          Unauthorized: {
            description: 'Korisnik nije autorizovan',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'Token nije pronađen. Morate biti prijavljeni.' } } },
          },
          NotFound: {
            description: 'Resurs nije pronađen',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'Košnica nije pronađena.' } } },
          },
          ServerError: {
            description: 'Interna greška servera',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: 'Greška na serveru.' } } },
          },
        },
      },
      security: [{ cookieAuth: [] }],
    },
  });
};