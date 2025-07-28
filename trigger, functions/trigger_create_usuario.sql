use sys_reserva;

DELIMITER //

CREATE TRIGGER trigger_usuario_ja_cadastrado
BEFORE INSERT ON usuarios
FOR EACH ROW
BEGIN
    DECLARE email_count INT;
    SELECT COUNT(*) INTO email_count -- verifica a quantidade de email igual já cadastrado. deve ser 0
    FROM usuarios
    WHERE email = NEW.email;

    IF email_count > 0 THEN
        SIGNAL SQLSTATE '12345' SET MESSAGE_TEXT = 'E-mail já cadastrado. Por favor, use outro e-mail.';
    END IF;
END;
//

DELIMITER ;