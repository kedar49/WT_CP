-- Sudoku App Stored Procedures and Triggers

-- Stored procedure to get a random puzzle of specified difficulty
DELIMITER //
CREATE PROCEDURE GetRandomPuzzle(IN diff VARCHAR(20))
BEGIN
    IF diff IS NULL THEN
        -- Get any random puzzle
        SELECT * FROM puzzles ORDER BY RAND() LIMIT 1;
    ELSE
        -- Get random puzzle of specified difficulty
        SELECT * FROM puzzles WHERE difficulty = diff ORDER BY RAND() LIMIT 1;
    END IF;
END //
DELIMITER ;

-- Stored procedure to get user progress with puzzle details
DELIMITER //
CREATE PROCEDURE GetUserProgressWithPuzzleDetails(IN user_id_param INT)
BEGIN
    SELECT 
        up.id,
        up.user_id,
        up.puzzle_id,
        p.difficulty,
        up.is_completed,
        up.time_spent,
        up.hints_used,
        up.created_at,
        up.updated_at
    FROM 
        user_progress up
    JOIN 
        puzzles p ON up.puzzle_id = p.id
    WHERE 
        up.user_id = user_id_param
    ORDER BY 
        up.updated_at DESC;
END //
DELIMITER ;

-- Stored procedure to update user statistics after completing a puzzle
DELIMITER //
CREATE PROCEDURE UpdateUserStatsAfterCompletion(
    IN user_id_param INT,
    IN puzzle_id_param INT,
    IN completion_time INT
)
BEGIN
    DECLARE diff VARCHAR(20);
    
    -- Get puzzle difficulty
    SELECT difficulty INTO diff FROM puzzles WHERE id = puzzle_id_param;
    
    -- Update general completion count
    UPDATE user_statistics 
    SET puzzles_completed = puzzles_completed + 1
    WHERE user_id = user_id_param;
    
    -- Update difficulty-specific completion count
    CASE diff
        WHEN 'Easy' THEN
            UPDATE user_statistics 
            SET easy_completed = easy_completed + 1
            WHERE user_id = user_id_param;
            
            -- Update best time if needed
            UPDATE user_statistics
            SET best_time_easy = 
                CASE 
                    WHEN best_time_easy IS NULL THEN completion_time
                    WHEN completion_time < best_time_easy THEN completion_time
                    ELSE best_time_easy
                END
            WHERE user_id = user_id_param;
            
        WHEN 'Medium' THEN
            UPDATE user_statistics 
            SET medium_completed = medium_completed + 1
            WHERE user_id = user_id_param;
            
            -- Update best time if needed
            UPDATE user_statistics
            SET best_time_medium = 
                CASE 
                    WHEN best_time_medium IS NULL THEN completion_time
                    WHEN completion_time < best_time_medium THEN completion_time
                    ELSE best_time_medium
                END
            WHERE user_id = user_id_param;
            
        WHEN 'Hard' THEN
            UPDATE user_statistics 
            SET hard_completed = hard_completed + 1
            WHERE user_id = user_id_param;
            
            -- Update best time if needed
            UPDATE user_statistics
            SET best_time_hard = 
                CASE 
                    WHEN best_time_hard IS NULL THEN completion_time
                    WHEN completion_time < best_time_hard THEN completion_time
                    ELSE best_time_hard
                END
            WHERE user_id = user_id_param;
            
        WHEN 'Expert' THEN
            UPDATE user_statistics 
            SET expert_completed = expert_completed + 1
            WHERE user_id = user_id_param;
            
            -- Update best time if needed
            UPDATE user_statistics
            SET best_time_expert = 
                CASE 
                    WHEN best_time_expert IS NULL THEN completion_time
                    WHEN completion_time < best_time_expert THEN completion_time
                    ELSE best_time_expert
                END
            WHERE user_id = user_id_param;
    END CASE;
END //
DELIMITER ;

-- Trigger to initialize user statistics when a new user is created
DELIMITER //
CREATE TRIGGER after_user_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    INSERT INTO user_statistics (user_id) VALUES (NEW.id);
END //
DELIMITER ;

-- Trigger to automatically update statistics when a puzzle is marked as completed
DELIMITER //
CREATE TRIGGER after_puzzle_completion
AFTER UPDATE ON user_progress
FOR EACH ROW
BEGIN
    -- Check if the puzzle was just completed
    IF NEW.is_completed = TRUE AND OLD.is_completed = FALSE THEN
        -- Call the stored procedure to update statistics
        CALL UpdateUserStatsAfterCompletion(NEW.user_id, NEW.puzzle_id, NEW.time_spent);
    END IF;
END //
DELIMITER ;

-- Function to check if a puzzle solution is valid
DELIMITER //
CREATE FUNCTION IsValidSolution(solution_json JSON) RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE row_idx INT DEFAULT 0;
    DECLARE col_idx INT DEFAULT 0;
    DECLARE cell_value INT;
    DECLARE row_sum INT;
    DECLARE col_sum INT;
    
    -- Check each row
    WHILE row_idx < 9 DO
        SET row_sum = 0;
        SET col_idx = 0;
        
        WHILE col_idx < 9 DO
            SET cell_value = JSON_EXTRACT(solution_json, CONCAT('$.grid[', row_idx, '][', col_idx, ']'));
            
            -- Check if value is between 1-9
            IF cell_value < 1 OR cell_value > 9 THEN
                RETURN FALSE;
            END IF;
            
            SET row_sum = row_sum + cell_value;
            SET col_idx = col_idx + 1;
        END WHILE;
        
        -- Sum of each row should be 45 (1+2+3+...+9)
        IF row_sum != 45 THEN
            RETURN FALSE;
        END IF;
        
        SET row_idx = row_idx + 1;
    END WHILE;
    
    -- Check each column
    SET col_idx = 0;
    WHILE col_idx < 9 DO
        SET col_sum = 0;
        SET row_idx = 0;
        
        WHILE row_idx < 9 DO
            SET cell_value = JSON_EXTRACT(solution_json, CONCAT('$.grid[', row_idx, '][', col_idx, ']'));
            SET col_sum = col_sum + cell_value;
            SET row_idx = row_idx + 1;
        END WHILE;
        
        -- Sum of each column should be 45
        IF col_sum != 45 THEN
            RETURN FALSE;
        END IF;
        
        SET col_idx = col_idx + 1;
    END WHILE;
    
    -- If all checks pass
    RETURN TRUE;
END //
DELIMITER ;

-- Stored procedure to get leaderboard for a specific difficulty
DELIMITER //
CREATE PROCEDURE GetLeaderboard(IN diff VARCHAR(20), IN limit_count INT)
BEGIN
    CASE diff
        WHEN 'Easy' THEN
            SELECT 
                u.username, 
                us.best_time_easy AS best_time
            FROM 
                user_statistics us
            JOIN 
                users u ON us.user_id = u.id
            WHERE 
                us.best_time_easy IS NOT NULL
            ORDER BY 
                us.best_time_easy ASC
            LIMIT limit_count;
            
        WHEN 'Medium' THEN
            SELECT 
                u.username, 
                us.best_time_medium AS best_time
            FROM 
                user_statistics us
            JOIN 
                users u ON us.user_id = u.id
            WHERE 
                us.best_time_medium IS NOT NULL
            ORDER BY 
                us.best_time_medium ASC
            LIMIT limit_count;
            
        WHEN 'Hard' THEN
            SELECT 
                u.username, 
                us.best_time_hard AS best_time
            FROM 
                user_statistics us
            JOIN 
                users u ON us.user_id = u.id
            WHERE 
                us.best_time_hard IS NOT NULL
            ORDER BY 
                us.best_time_hard ASC
            LIMIT limit_count;
            
        WHEN 'Expert' THEN
            SELECT 
                u.username, 
                us.best_time_expert AS best_time
            FROM 
                user_statistics us
            JOIN 
                users u ON us.user_id = u.id
            WHERE 
                us.best_time_expert IS NOT NULL
            ORDER BY 
                us.best_time_expert ASC
            LIMIT limit_count;
            
        ELSE
            -- Overall leaderboard based on total puzzles completed
            SELECT 
                u.username, 
                us.puzzles_completed
            FROM 
                user_statistics us
            JOIN 
                users u ON us.user_id = u.id
            ORDER BY 
                us.puzzles_completed DESC
            LIMIT limit_count;
    END CASE;
END //
DELIMITER ; 