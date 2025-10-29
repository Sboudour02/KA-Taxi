from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
import ssl
import os
from email.mime.text import MIMEText # Import for proper email formatting

app = Flask(__name__)
CORS(app)

# --- Email Configuration (using Environment Variables) ---
# These will be set on Render.com
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "sboudour02@gmail.com") # Default for local testing
SENDER_APP_PASSWORD = os.environ.get("SENDER_APP_PASSWORD", "zmts emgj czpo jkeg") # Default for local testing
RECIPIENT_EMAIL = os.environ.get("RECIPIENT_EMAIL", "sboudour02@gmail.com") # Default for local testing

# SMTP Server details for Gmail
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587 # For TLS

@app.route('/submit', methods=['POST'])
def submit_form():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    print("Received data:", data)

    # --- Log Environment Variables for Debugging ---
    print(f"DEBUG: SENDER_EMAIL={SENDER_EMAIL}")
    print(f"DEBUG: SENDER_APP_PASSWORD={'*' * len(SENDER_APP_PASSWORD) if SENDER_APP_PASSWORD else 'None'}") # Mask password
    print(f"DEBUG: RECIPIENT_EMAIL={RECIPIENT_EMAIL}")

    # --- Construct Email Message ---
    full_name = data.get("fullName", "N/A")
    email = data.get("email", "N/A")
    phone = data.get("phone", "N/A")
    pickup = data.get("pickup", "N/A")
    destination = data.get("destination", "N/A")
    appointment = data.get("appointment", "N/A")
    message_body = data.get("message", "Aucun message supplémentaire.")

    email_subject = f"Nouvelle demande de réservation de {full_name}"
    email_content = f"""
Vous avez reçu une nouvelle demande de réservation via votre site web.

Voici les détails:

Nom et prénom : {full_name}
Email : {email}
Téléphone : {phone}
Point de départ : {pickup}
Point d'arrivée : {destination}
Date et heure : {appointment}

Message supplémentaire:
{message_body}
"""
    msg = MIMEText(email_content, 'plain', 'utf-8')
    msg['Subject'] = email_subject
    msg['From'] = SENDER_EMAIL
    msg['To'] = RECIPIENT_EMAIL

    # --- Send Email ---
    try:
        context = ssl.create_default_context()
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls(context=context)
            server.login(SENDER_EMAIL, SENDER_APP_PASSWORD)
            server.sendmail(SENDER_EMAIL, RECIPIENT_EMAIL, msg.as_string())
        
        print("Email sent successfully!")
        return jsonify({"result": "success", "message": "Demande envoyée avec succès."})

    except smtplib.SMTPAuthenticationError as e:
        print(f"ERROR: SMTP Authentication Failed! Check SENDER_EMAIL and SENDER_APP_PASSWORD. Details: {e}")
        return jsonify({"result": "error", "message": "Erreur d'authentification SMTP. Vérifiez les identifiants.", "details": str(e)}), 500
    except smtplib.SMTPRecipientsRefused as e:
        print(f"ERROR: SMTP Recipient Refused! Check RECIPIENT_EMAIL. Details: {e}")
        return jsonify({"result": "error", "message": "Destinataire refusé. Vérifiez l'adresse email.", "details": str(e)}), 500
    except smtplib.SMTPException as e:
        print(f"ERROR: General SMTP Error! Details: {e}")
        return jsonify({"result": "error", "message": f'Erreur SMTP générale: {str(e)}'}), 500
    except Exception as e:
        print(f"ERROR: Unexpected error during email sending: {e}")
        return jsonify({"result": "error", "message": f'Erreur inattendue lors de l\'envoi de l\'email: {str(e)}', "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
