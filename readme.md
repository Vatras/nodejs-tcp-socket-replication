Temat projektu:
Projekt polega na stworzeniu serwera www, ma który umożliwia uploadowanie plików do folderu o nazwie wpisanej przy uploadzie. 
Zuploadowane pliki następnie mają być przesyłane do drugiego serwera który nasłuchuje na konkretnym porcie na połączenia TCP.

Pliki:
package.json - plik z dependencies dla serwera HTTP
socketServer.js - plik z kodem serwera na którym ostatecznie mają się znaleźć pliki
httpServer.js - plik z kodem serwera HTTP, komunikującym się z powyższym serwerem przez sockety tcp.
Kompliacja  
    npm install (tylko na serwerze HTTP)

Uruchomienie:
    Serwer otrzymujacy pliki:
    node socketServer.js MY_IP PORT
    
    Serwer HTTP: 
    
    node httpServer.js IP_SERWERA_SOCKETOWEGO PORT_SERWERA_SOCKETOWEGO


