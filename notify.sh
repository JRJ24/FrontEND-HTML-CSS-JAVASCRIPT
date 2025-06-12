#!/bin/bash

# Asegúrate de que NTFY_TOPIC o NTFY_URL se pasen como variables de entorno
# o estén definidos directamente aquí.
# Si NTFY_TOPIC no está definido como env var, usa un valor por defecto.
NTFY_TOPIC="${NTFY_TOPIC:-mi_topico_por_defecto_ntfy}"

# Variables de contexto de GitHub Actions (pasadas como env vars)
REPO_NAME="$GITHUB_REPO"
RUN_ID="$GITHUB_RUN_ID"
ACTOR="$GITHUB_ACTOR"
EVENT_NAME="$GITHUB_EVENT_NAME"

# Mensaje de notificación
MESSAGE="Workflow '$GITHUB_RUN_ID' en $REPO_NAME por $ACTOR ha terminado debido a un evento de $EVENT_NAME."
TITLE="Estado del Workflow en $REPO_NAME"

# URL de ntfy.sh
# Si usas una URL base desde Secrets, descomenta y usa ${{ secrets.NTFY_SH_BASE_URL }}/$NTFY_TOPIC
NTFY_URL="https://ntfy.sh/$NTFY_TOPIC" # Reemplaza con la base URL de tu ntfy.sh si es personalizada

echo "Enviando notificación a $NTFY_URL con el título: $TITLE y mensaje: $MESSAGE"

curl -H "Title: $TITLE" \
     -d "$MESSAGE" \
     "$NTFY_URL"

# Opcional: Manejo de errores para curl
if [ $? -ne 0 ]; then
    echo "Error al enviar la notificación a ntfy.sh"
    exit 1 # Fallar el paso del workflow si la notificación falla
fi