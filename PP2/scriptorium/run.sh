npm run dev &
NPM_PID=$!
sleep 5  # wait for the npm server to start
python3 algorithm_analysis/app.py
wait $NPM_PID
