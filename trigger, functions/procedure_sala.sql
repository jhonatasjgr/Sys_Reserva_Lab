DELIMITER //

-- procedimento para criar sala
CREATE PROCEDURE CriarSala(
    IN p_nome VARCHAR(100),
    IN p_capacidade INT,
    IN p_tipo_sala_id INT 
)
BEGIN
    INSERT INTO salas (nome, capacidade, tipo_salaId, createdAt, updatedAt) -- Usando tipo_salaId
    VALUES (p_nome, p_capacidade, p_tipo_sala_id, NOW(), NOW());

    SELECT
        s.*,
        ts.id AS tipo_sala_id, 
        ts.nome_tipo AS tipo_sala_nome
    FROM
        salas s
    JOIN
        tipos_sala ts ON s.tipo_salaId = ts.id
    WHERE s.id = LAST_INSERT_ID(); --  ultimo id
END //

-- procedimento para listrar todas as salas
CREATE PROCEDURE ObterTodasSalas()
BEGIN
    SELECT
        s.*,
        ts.id AS tipo_sala_id_retorno,
        ts.nome_tipo AS tipo_sala_nome_retorno
    FROM
        salas s
    JOIN
        tipos_sala ts ON s.tipo_salaId = ts.id;
END //

-- procedimento para buscar uma unica sala
CREATE PROCEDURE ObterSalaPorId(
    IN p_id INT
)
BEGIN
    SELECT
        s.*,
        ts.id AS tipo_sala_id_retorno,
        ts.nome_tipo AS tipo_sala_nome_retorno
    FROM
        salas s
    JOIN
        tipos_sala ts ON s.tipo_salaId = ts.id
    WHERE
        s.id = p_id;
END //
