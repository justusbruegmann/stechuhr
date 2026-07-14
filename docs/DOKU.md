# How2CenterADiv Stechuhr
## Matrikelnummern:
    - justusbruegmann: 4865545
    - SebastianAnhalt: nummer Einfügen
    - mika630 : nummer Einfügen
    - FHG : nummer Einfügen Bitte beachten Github Email und git Email unterschiedlich da Firmen Laptop
    - brdly06: Nummer einfügen
# Was macht die Anwendung? (Mika)
# Setup der Dev Umgehbung
# Starten der Anwendung
# Struktur des Repo
# Webdesign (Aaron & Felix)
# Eigenleistung
## Auth 4865545
### Ideen
Es wurde sich Aktiv gegen JWTs entschieden da dort der Zugang nicht schnell entfernt werden kann.
Ebenfalls soll ein Admin als Verwalter Accounts erstellen da kein Mitarbeiter sein Account selbst anlegen soll.
Im fall einer Kündigung oder ähnliches kann der Admin sehr schnell Zugang zur Zeiterfassung entfernen damit kein Unsinn getrieben wird.

Es gibt 3 Rollen in er Anwendung:
- User: Ein ganznormaler Mitarbeiter
- Manager: Ein vorgesetzter von einem Nutzer welcher Urlaubsanträge oder ähnliches bearbeiten kann sowie Arbeitszeiten seiner untergebenen sehen kann.
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

