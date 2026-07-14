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
Die Auth hat 2 Routen 
1. GET /auth/ nimmt den session token und checkt ob dieser valid ist für den User  
    input Header: authorization, userid
    output json:{"role","id"}   
    Statuscodes:  
        - 200: Token ist valid  
        - 401: unauthorized wenn token ungültig  
        - 404: wenn auth() return undefined  
        - 485: Custom code dafür wenn der User ein one-time-password gesetzt hat     
        - 500: Alg error  
    id ist die user ID, session ist der Session token, role ist die Rolle welche der Nutzer 
    in der Anwendung hat
2. POST /login/ nimmt im Body den Username und das Passwort wenn diese Valide sind wird   
    input body: {"username","password}  
    output json: {"id","session","role"}
    Statuscodes:  
        - 201: username password sind valid  
        - 400: no body  
        - 401: unauthorized wenn token ungültig  
        - 404: wenn auth() return undefined  
        - 485: Custom code dafür wenn der User ein one-time-password gesetzt hat     
        - 500: Alg error  