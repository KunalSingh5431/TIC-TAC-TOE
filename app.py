from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

def initialize_board():
    return [0] * 9

board = initialize_board()
current_player = "X"
player_names = {"X": "", "O": ""}

def analyze_board(board):
    cb = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [2, 5, 8], [1, 4, 7], [0, 4, 8], [2, 4, 6]]
    for pattern in cb:
        if board[pattern[0]] != 0 and board[pattern[0]] == board[pattern[1]] == board[pattern[2]]:
            return board[pattern[0]]
    return 0

def minmax(board, player):
    result = analyze_board(board)
    if result != 0:
        return result * player

    best_value = -2
    pos = -1
    for i in range(9):
        if board[i] == 0:
            board[i] = player
            value = -minmax(board, -player)
            board[i] = 0
            if value > best_value:
                best_value = value
                pos = i

    if pos == -1:
        return 0
    return best_value

def computer_turn(board):
    best_value = -2
    pos = -1
    for i in range(9):
        if board[i] == 0:
            board[i] = 1
            value = -minmax(board, -1)
            board[i] = 0
            if value > best_value:
                best_value = value
                pos = i

    board[pos] = 1

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start', methods=['POST'])
def start_game():
    global board, current_player, player_names
    board = initialize_board()
    current_player = "X"

    data = request.json
    mode = data.get("mode")
    player1 = data.get("player1")
    player2 = data.get("player2", "AI")

    player_names = {"X": player1, "O": player2}

    return jsonify({"status": "success", "message": "Game started!"})

@app.route('/play', methods=['POST'])
def play_turn():
    global board, current_player
    data = request.json
    position = data.get("position")

    if board[position] != 0:
        return jsonify({"status": "error", "message": "Invalid move!"})

    board[position] = -1 if current_player == "X" else 1

    winner = analyze_board(board)
    if winner != 0:
        return jsonify({"status": "win", "winner": player_names[current_player]})

    if 0 not in board:
        return jsonify({"status": "draw"})

    current_player = "O" if current_player == "X" else "X"

    if current_player == "O" and player_names["O"] == "AI":
        computer_turn(board)
        winner = analyze_board(board)
        if winner != 0:
            return jsonify({"status": "win", "winner": "AI"})
        if 0 not in board:
            return jsonify({"status": "draw"})
        current_player = "X"

    return jsonify({"status": "continue", "board": board, "current_player": current_player})

@app.route('/reset', methods=['POST'])
def reset_game():
    global board, current_player
    board = initialize_board()
    current_player = "X"
    return jsonify({"status": "success", "message": "Game reset!"})

if __name__ == "__main__":
    app.run(debug=True)
