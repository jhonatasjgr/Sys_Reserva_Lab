USE sys_reserva;

DELIMITER //

DROP TRIGGER IF EXISTS trigger_conflito_data_reserva; -- Adicione esta linha para poder recriar o trigger

CREATE TRIGGER trigger_conflito_data_reserva
BEFORE INSERT ON reservas
FOR EACH ROW
BEGIN
    DECLARE conflito_encontrado INT;
    DECLARE status_nome_pendente VARCHAR(50);
    DECLARE status_nome_em_andamento VARCHAR(50);
    -- DECLARE status_nome_aprovada VARCHAR(50); -- Variável para o status APROVADA - Removida

    -- Popula as variáveis com os nomes dos status
    SELECT nome_status INTO status_nome_pendente FROM status_reserva WHERE id = 1; -- ID para PENDENTE
    SELECT nome_status INTO status_nome_em_andamento FROM status_reserva WHERE id = 2; -- ID para EM_ANDAMENTO
    -- --- NOVO: Popula a variável para o status APROVADA --- - Removida
    -- SELECT nome_status INTO status_nome_aprovada FROM status_reserva WHERE id = 3; -- Assumindo ID 3 para APROVADA - Removida

    -- Verifica se a reserva ocorre no mesmo intervalo de horário de alguma reserva que não foi concluída nem cancelada
    SELECT COUNT(*) INTO conflito_encontrado -- quantidade de reservas nesse horário
    FROM reservas r
    JOIN status_reserva sr ON r.statusReservaId = sr.id
    WHERE r.salaId = NEW.salaId
      AND sr.nome_status IN (status_nome_pendente, status_nome_em_andamento) -- ALTERADO: Apenas PENDENTE e EM_ANDAMENTO
      AND (
            (NEW.dataInicio < r.dataFim AND NEW.dataFim > r.dataInicio)
          );

    IF conflito_encontrado > 0 THEN
        SIGNAL SQLSTATE '12345' SET MESSAGE_TEXT = 'Conflito de horário: A sala já está reservada neste período.';
    END IF;
END;
//

DELIMITER ;
