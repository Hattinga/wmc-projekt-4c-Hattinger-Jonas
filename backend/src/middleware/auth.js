// TODO: JWT-Middleware für geschützte Routen.
// Liest Bearer-Token aus Authorization-Header.
// Verifiziert mit JWT_SECRET (aus .env).
// Schreibt dekodierten User (id, email) auf req.user.
// Antwortet mit 401 bei fehlendem oder ungültigem Token.
