# How2CenterADiv Stechuhr
## Matrikelnummern:
    - justusbruegmann: 4865545
    - SebastianAnhalt: 7020807
    - mika630: 1586623
    - FHG : nummer Einfügen Bitte beachten Github Email und git Email unterschiedlich da Firmen Laptop
    - brdly06: Nummer einfügen
AI als Formulierungshilfe verwendet
# Was macht die Anwendung? (Mika)
# Struktur des Repo (Sebastian)
# Setup der Dev Umgebung (Justus)

> Wichtig:  
> node und npm sind vorrausgesetzt sowie ein postgresSQL DBconnectionlink  
> Es gibt das Ganze SQL DB Script als sql Datei im docs Verzeichnis


Zuerst das Projekt Klonen

``git clone https://github.com/justusbruegmann/stechuhr.git``

## Frontend

Für das Frontend

````cmd
    cd frontend
    npm install
````

Dann muss eine ".env.local" im frontend Ordner ein mit
``NEXT_PUBLIC_BACKEND_URL=<BACKENDURL EINSETZEN>
`` vorhandensein.  
Mögliche werte:
- Lokales backend:   http://localhost:3500
- Hosted backend:   https://stechuhr-production-2a78.up.railway.app

Zum Starten ``npm run dev``


### Backend

Für das Backend

````cmd
    cd backend
    npm install
````

Dann muss eine ".env" im Backend Ordner ein mit
``DATABASE_URL=<DATENBANK_URL EINSETZEN>
`` vorhandensein.

Datenbank_URL wird noch bereit gestellt

zum Starten ``npm run dev``
nach jeder Änderung muss der command neu ausgeführt werden (kein HMR) und gewartet werden bis ``✓ Database connection successful
`` in der Console auftaucht dann ist das Backend bereit. 



# Starten der Anwendung (Justus)

> Wichtig:  
> node und npm sind vorrausgesetzt sowie ein postgresSQL DBconnectionlink  
> Es gibt das Ganze SQL DB Script als sql Datei im docs Verzeichnis

Zuerst das Projekt Klonen

``git clone https://github.com/justusbruegmann/stechuhr.git``

### Bauen
Zum Bauen muss das ``build.ps1`` script ausgeführt werden oder eins der Scripte ausgeführt werden aus dem root directory:

Beim build muss eine ".env.local" im frontend Ordner ein mit
``NEXT_PUBLIC_BACKEND_URL=<BACKENDURL EINSETZEN>
`` vorhandensein.  
Mögliche werte:
- Lokales backend:   http://localhost:3500
- Hosted backend:   https://stechuhr-production-2a78.up.railway.app


Cross-Plattform pwsh:  
``./build.ps1``

Windows:  
``.\build.bat``

Linux:  
``bash build.sh``

Zum Starten muss eine ".env" im Backend Ordner ein mit
``DATABASE_URL=<DATENBANK_URL EINSETZEN>
`` vorhandensein.

Datenbank_URL wird noch bereit gestellt

### Starten
Backend und Frontend laufen als getrennte Prozesse und werden jeweils in einem eigenen Terminal gestartet:

Backend (Terminal 1):
```cmd
   cd backend
   npm start
   ```   
   
  Warten bis ✓ Database connection successful in der Console erscheint, dann ist das Backend bereit.

  Frontend (Terminal 2):

      cd frontend
      npm start

  Die Anwendung ist danach unter http://localhost:3000 erreichbar.


# Webdesign (Aaron & Felix)



# Struktur des Repositories
Das Repository ist als Monorepo in zwei Hauptteilen aufgebaut: Backend und Frontend. Zusätzlich liegt die Dokumentation des gesamten Monorepos im Ordner /docs.

Frontend und Backend sind eigenständige und voneinander losgelöste npm packages.

## Frontend
Das Frontend ist ein Next.js-Projekt, das auf der Vorlesungsvorlage mit React und TypeScript basiert.

Dementsprechend beinhaltet der Root Ordner Konfigurationsdateien wie *.env*, *.gitignore*, *package.json*, etc., sowie die Assets in **/public** und den Quellcode-Ordner **/src**.
Der Quellcode der Anwendung ist in folgenden Ordnern strukturiert:

### /src/app
Die Web-Anwendung verwendet den AppRouter, deshalb entspricht die Ordnerstruktur in /src/app den URL-Pfaden der Webseite.

Im Allgemeinen hat jede Route zwingend eine page.tsx-Datei, deren Inhalt unter dieser URL gerendert und angezeigt wird.
Außerdem können hier weitere Dateien wie z.B. CSS-Stylesheets (seitenname.module.css) oder lokal verwendete Components abgelegt sein.

#### Routen
**/**
Enthält eine page.tsx, die nur eine Umleitung auf **/dashboard** auslöst.
Zusätzlich dazu liegen hier auch allgemeine Konfigurationen der Webseite:
- Das Favicon
- Ein Stylesheet, das globale Variablen definiert
- layout.tsx, welches den äußeren HTML-Rahmen der Seite definiert und benötigte Kontexte (hier nur ModalProvider) einbindet
- Eine not-found Seite, die als catch-all auf alle nicht definierten Routen reagiert

**/dashboard**
Das Dashboard ist die Hauptseite der Anwendung.
Sie enthält die Einstempelfunktion und einen Kalender.

**/login**
Die Login-Seite.

**/admin_view**
Eine Seite zur Benutzerverwaltung, auf die nur Admin-Accounts Zugriff haben.
Hier können neue Benutzer angelegt, bestehende Benutzer gelöscht, und ihre Rollen und die Zuordnung zu Vorgesetzten (Managern) verändert werden.

**/manager_view**
Diese Seite wird nur für Manager-Accounts mit Inhalt befüllt, alle anderen sehen eine Fehlermeldung.
Hierauf können Manager die Arbeitszeiten, Urlaubstage ihrer Mitarbeiter einsehen und bearbeiten, sowie eine Zusammenfassung der geleisteten Wochenarbeitszeit, genehmigter Urlaubstage und eingetragener Krankheitstage sehen.
Außerdem können offene Anträge hier anzeigen lassen und akzeptieren / ablehnen.


### /src/components
Hier befinden sich alle React-Components.
// ToDo



## Backend
Das Backend ist als Express-Server in TypeScript realisiert.

Die Design-Philosophie des Backends ist ein Drei-Schichten-Modell, bestehend aus 
1. HTTP-Layer in **./route**
2. Domainlogik-Layer in **./service**
3. Datenbank-Layer in **./repository**

### HTTP Layer
Hier werden die router-Objekte mitsamt Routen und Handler-Funktionen definiert.
Authentifizierung wird hauptsächlich durch eingebundene Middleware aus dem Ordner **/middleware** umgesetzt.
Autorisierung und Input-Validierung werden in den Handler-Funktionen geprüft.
Nach erfolgreicher Prüfung wird die Domain-Logik aufgerufen.

### Domainlogik-Layer
Die Logik und eigentliche Backend-Funktionalität der Anwendung wird in den Services (**/service**) implementiert.
Diese rufen die Repository-Funktionen auf, um mit der PostgreSQL-Datenbank auf Supabase zu kommunizieren.

### Datenbank-Layer
Die Datenbank-Konnektoren in /repository sind dünne Wrapper-Funktionen, die je eine einzelne SQL-Anfrage an die Datenbank beinhalten.
Sie kennen keine Logik oder Validierung und sind ausschließlich für die strukturierte und einfach wartbare Kommunikation mit der Datenbank zuständig.

### Sonstiges

**/**
Die Project Root beinhaltet die üblichen Konfigurationsdateien wie *.env*, *.gitignore*, *Dockerfile*, *package.json*, etc., sowie den Einstiegspunkt *app.ts* der Anwendung.

**/drizzle**
Der Drizzle-Ordner beinhaltet nur das ORM-Schema, auf dem die Datenbankverbindung der repository-Funktionen basiert.

**/middleware**
In diesem Ordner sind die Middleware-Funktionen abgelegt, die von mehreren Routen verwendet werden.

**/schemas**
Hier sind Zod-Schemas zur Input-Validierung definiert.

**/types**
Geteilte TypeScript types und interfaces sind hier abgelegt.

**/utils**
Hier befinden sich geteilte Hilfsfunktionen, die an verschiedenen Stellen in der Anwendung Verwendung finden.
Sie sind grob nach Anwendungsgebiet gruppiert.



# Eigenleistung
## Auth 4865545
### Ideen
Aufgrund von Kommunikation aus dem ersten Semester, dass nur das absolute Minimum an Fremdpakete verwendet werden soll, wurde angenommen das auch Login usw selbst gebaut werden müssen.
Deshalb wurde bereits vor der Kommunikation, dass solche Pakete erlaubt sind, das Feature schon fertiggestellt.



Es wurde sich Aktiv gegen JWTs entschieden da dort der Zugang nicht schnell entfernt werden kann.
Ebenfalls soll ein Admin als Verwalter Accounts erstellen da kein Mitarbeiter sein Account selbst anlegen soll.
Im fall einer Kündigung oder ähnliches kann der Admin sehr schnell Zugang zur Zeiterfassung entfernen damit kein Unsinn getrieben wird.

Es gibt 3 Rollen in er Anwendung:
- User: Ein ganz normaler Mitarbeiter
- Manager: Ein vorgesetzter von einem Nutzer welcher Urlaubsanträge oder ähnliches bearbeiten kann sowie Arbeitszeiten seiner untergebenen sehen kann. User + zusatz Rechte
- Admin: Reiner Verwaltungsaccount kann keine timeEntries erstellen.

### Gesamtprojekt
Als erstes landet der Nutzer auf der Login page und muss sich dort einloggen.  
Wenn er ein one time password hat dann muss dieses verändert werden.
Wenn kein one time password gesetzt ist und die login daten Valide wird dieser zum dashboard weitergeleitet
  
Die Auth läuft im Hintergrund beim öffnen einer page zum check onb der Token noch valid ist oder überhaupt einer existiert.
  
Ebenfalls wird ein für die anderen Routen eine Middleware gegeben ob die mitgegebenen Authorization und userid einem User gehören.
Dies ist dabei für fast jede Route relevant da nur Nutzer welche zur Anwendung gehören diese Aktionen ausführen sollen.
```typescript
const ROLESPERMS: Record<UserRole,number> = {user: 1, manager: 2 , admin:3};

export function authMiddleware(requiredRole: UserRole, rolesAboveAllowed: boolean = false) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            const id = Number(req.headers.userid);
            if (!token || !id) {
                return res.status(401).json({"error": "No token provided"});
            }
            const authUser = await authHelper(token, id);
            if (!authUser?.authorized || !authUser.data.id || !authUser.data.role) {
                return res.status(401).json({"error": "unauthorized"});
            }
            if (rolesAboveAllowed) {
                const authUserLevel = ROLESPERMS[authUser.data.role as UserRole];
                const requiredLevel = ROLESPERMS[requiredRole];
                if (authUserLevel < requiredLevel) return res.status(403).json({error: "unauthorized"});
            } else {
                if (authUser.data.role !== requiredRole) return res.status(403).json({error: "unauthorized"});
            }
            res.locals.user = {id: authUser.data.id, role: authUser.data.role};
            next();
        } catch (e) {
            return res.status(500).json({"error": "internal error"});
        }
    }
}
```
rolesAboveAllowed sagt aus ob eine Route welche ein user zugreifen darf auch ein Manager oder Admin zugreifen darf


### Code

Backend Code ist im Ordner "backend" zu finden.  
Dabei gibt es in /route,/service,/repository die Datein Auth.ts und der OTPchange liegt in Usermanagement.ts  
Dazu sind in /utils hashing.ts und auth.ts  
Ebenfalls gibt es in /middleware die authmiddleware().

Frontend code ist im Ordner "frontend" zu finden.  
Für das Loginform sind in src/app/login die relevante css und page.tsx zu finden.  
Für die Passwortänderung das Popup ist in src/components/login die PasswordChangeModal.tsx zu finden

Alle drei fetch calls die für die Auth verantwortlich ist sind in src/scripts/auth.ts zu finden.

Es gibt auch noch die authCheck() Methode das Prinzip von der wird öfters im Frontend von allen verwendet.  
Diese hier ist spziell in src/app/dashboard/page.tsx zufinden
````typescript
async function authCheck() {
    const token = localStorage.getItem("token")
    const userid = localStorage.getItem("userid")

    if (!token || !userid) {
        router.push("/login")
        return
    }

    const login = await loginToken(token, userid);

    if (!login || login === 401 || login === 485 || login === 400) {
        router.push("/login")
        return;
    }

    localStorage.setItem("role", login.role);
}
````
### Backend
Die Auth hat 3 Routen 
1. GET /auth/ nimmt den session token und checkt ob dieser valid ist für den User  
    input Header: authorization, userid
    output json:{"role","id"}   
    Statuscodes:  
        - 200: Token ist valid  
        - 401: unauthorized wenn token ungültig  
        - 404: wenn auth() return undefined  
        - 485: Custom code dafür wenn der User ein one-time-password gesetzt hat. damit das frontend nur eine zahl checken muss     
        - 500: Alg error  
    id ist die user ID, session ist der Session token, role ist die Rolle welche der Nutzer 
    in der Anwendung hat
2. POST /login/ nimmt im Body den Username und das Passwort wenn diese Valide sind wird   
    input body: {"username","password"}  
    output json: {"id","session","role"}  
    Statuscodes:  
        - 201: username password sind valid  
        - 400: no body  
        - 401: unauthorized wenn username and password ungültig  
        - 404: wenn auth() return undefined  
        - 485: Custom code dafür wenn der User ein one-time-password gesetzt hat. damit das frontend nur eine zahl checken muss     
        - 500: Alg error  
3. PATCH aufgrund von CORS aktuell PUT /users/otp/:id zum ändern des oneTimePassword das man vom Admin bekommt  
    input body: {"currentpwd","newpwd"}  
    input params: id  
    output text: "changed succesfully"  
    Statuscodes:  
        - 400: no body or types wrong, or password incorect scheme  
        - 401: currentpwd is wrong  
        - 200: Password changed succesfully need to login with new password
        - 500: internal server error

### Frontend

Das login-Form sieht so aus:  
wenn der Nutzer sich einloggt erscheint ein spinner auf dem Login Button.  
bei erfolgreichem Login wird der Nutzer zum dashboard weitergeleitet.  
![Loginform](images/login/loginForm.png)

  

Bei one Time Password wird ein Popup angezeigt.  
dabei muss der Nutzer sich ein neues Password vergeben welches nur er kennt.  
Wenn das Passwort verändert wurde kann der Nutzer sich normal anmelden.  
![otpForm](images/login/otpForm.png)

