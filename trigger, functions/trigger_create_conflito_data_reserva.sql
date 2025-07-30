USE sys_reserva;

DELIMITER //

DROP TRIGGER IF EXISTS trigger_conflito_data_reserva; -- nome da trigger

CREATE TRIGGER trigger_conflito_data_reserva
BEFORE INSERT ON reservas
FOR EACH ROW
BEGIN
    DECLARE conflito_encontrado INT;
    DECLARE status_nome_pendente VARCHAR(50); -- Variável para armazenar o nome do status PENDENTE
    DECLARE status_nome_em_andamento VARCHAR(50); -- Variável para armazenar o nome do status EM_ANDAMENTO

    -- Busca os nomes dos status PENDENTE e EM_ANDAMENTO
    SELECT nome_status INTO status_nome_pendente FROM status_reserva WHERE id = 1; -- id de PENDENTE
    SELECT nome_status INTO status_nome_em_andamento FROM status_reserva WHERE id = 2; -- id de EM_ANDAMENTO

    -- Verifica se a reserva ocorre no mesmo intervalo de horário de alguma reserva que não foi concluída nem cancelada
    SELECT COUNT(*) INTO conflito_encontrado -- quantidade de reservas nesse horário
    FROM reservas r
    JOIN status_reserva sr ON r.statusReservaId = sr.id
    WHERE r.salaId = NEW.salaId -- sala da nova reserva vs sala da reserva existente
      AND sr.nome_status IN (status_nome_pendente, status_nome_em_andamento) -- status que não foram concluídos nem cancelados
      AND (
            (NEW.dataInicio < r.dataFim AND NEW.dataFim > r.dataInicio)
          );

    IF conflito_encontrado > 0 THEN
        SIGNAL SQLSTATE '12345' SET MESSAGE_TEXT = 'Conflito de horário: A sala já está reservada neste período.';
    END IF;
END;
//

DELIMITER ;
