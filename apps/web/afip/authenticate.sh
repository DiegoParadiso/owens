#!/bin/bash

# Script de Autenticación AFIP (WSAA) - Versión Bash
# Basado en los 8 pasos proporcionados por el usuario.

# Configuración
CERT="afip/certificado.crt"
KEY="afip/privada.key"
SERVICE="wsfe"
URL="https://wsaahomo.afip.gov.ar/ws/services/LoginCms"

echo "--- Iniciando Autenticación AFIP (Bash) ---"

# 1. Generar timestamps correctos (Usa -1 hour para compensar posible drift)
DATE_GEN=$(date -u -d "-1 hour" +"%Y-%m-%dT%H:%M:%S-00:00")
DATE_EXP=$(date -u -d "+10 minutes" +"%Y-%m-%dT%H:%M:%S-00:00")
echo "   Timestamps (UTC) [-1H]: $DATE_GEN -> $DATE_EXP"

# 2. Crear TRA.xml
cat > afip/tra.xml <<EOF
<loginTicketRequest version="1.0">
  <header>
    <uniqueId>$(date +%s)</uniqueId>
    <generationTime>$DATE_GEN</generationTime>
    <expirationTime>$DATE_EXP</expirationTime>
  </header>
  <service>$SERVICE</service>
</loginTicketRequest>
EOF
echo "1. TRA.xml generado."

# 3. Firmar (CMS) - Todo en una sola línea para evitar errores de escape
openssl smime -sign -signer "$CERT" -inkey "$KEY" -in afip/tra.xml -out afip/login.cms -outform DER -nodetach
echo "2. CMS generado."

# 4. Convertir a base64
base64 -i afip/login.cms | tr -d '\n' > afip/login_base64.txt

# 5. Armar request SOAP
cat > afip/login.xml <<EOF
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsaa="http://wsaa.view.sua.dvadac.desein.afip.gov">
   <soapenv:Header/>
   <soapenv:Body>
      <wsaa:loginCms>
         <wsaa:in0>$(cat afip/login_base64.txt)</wsaa:in0>
      </wsaa:loginCms>
   </soapenv:Body>
</soapenv:Envelope>
EOF
echo "3. Request SOAP preparado."

# 6. Llamar WSAA
curl -s -X POST "$URL" -H "Content-Type: text/xml; charset=utf-8" -H 'SOAPAction: ""' -d @afip/login.xml > afip/response.xml
echo "4. Llamada a AFIP realizada."

# 7 & 8. Extraer token y sign
token=$(cat afip/response.xml | sed 's/&lt;/</g; s/&gt;/>/g; s/&quot;/"/g' | grep -o '<token>.*</token>' | sed 's/<[^>]*>//g')
sign=$(cat afip/response.xml | sed 's/&lt;/</g; s/&gt;/>/g; s/&quot;/"/g' | grep -o '<sign>.*</sign>' | sed 's/<[^>]*>//g')

if [ -z "$token" ] || [ -z "$sign" ]; then
    echo "ERROR: No se pudo extraer Token o Sign de AFIP."
    echo "REVISA afip/response.xml"
    exit 1
else
    echo "$token" > afip/token.txt
    echo "$sign" > afip/sign.txt
    echo "SUCCESS: token.txt y sign.txt actualizados."
fi

# Limpieza
rm afip/tra.xml afip/login.cms afip/login_base64.txt afip/login.xml
