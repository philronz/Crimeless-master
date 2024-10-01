import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Svg, { Circle } from 'react-native-svg';

const GamesScreen = ({ navigation }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [points, setPoints] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timer, setTimer] = useState(10);

  // Fetch game questions from the backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://192.168.1.34/crimeless/api.php?action=get_questions');
        const data = await response.json();
        if (data.error) {
          Alert.alert('Error', data.error);
        } else {
          setQuestions(data);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch questions');
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    let timerId;
    if (gameStarted && timer > 0) {
      timerId = setTimeout(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      handleNextQuestion();
    }

    return () => clearTimeout(timerId);
  }, [timer, gameStarted]);

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setTimer(10);
  };

  const handleAnswer = (selectedAnswer) => {
    const currentQuestion = questions[currentQuestionIndex];

    console.log(`Selected Answer: ${selectedAnswer}, Correct Answer: ${currentQuestion.gameanswer}`);

    if (selectedAnswer === currentQuestion.gameanswer) {
      Alert.alert('Correct!', `You earned ${currentQuestion.gamepoint} points.`);
      setPoints((prevPoints) => prevPoints + parseInt(currentQuestion.gamepoint));
    } else {
      Alert.alert('Incorrect!', 'Try again.');
    }

    handleNextQuestion();
  };

  if (currentQuestionIndex >= questions.length) {
    return (
      <LinearGradient colors={['#c0392b', '#FF9800']} style={styles.container}>
        <View style={styles.endGameContainer}>
          <Text style={styles.endGameText}>CONGRATULATIONS FOR HAVING CORRECT ANSWERS!</Text>
          <Text style={styles.badgeText}>RECEIVED A BADGE</Text>
          <Text style={styles.badgeName}>STREET MASTER</Text>
          <Text style={styles.endGamePoints}>Total Points: {points}</Text>
          <TouchableOpacity style={styles.restartButton} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>GO BACK</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <LinearGradient colors={['#FFB74D', '#FF9800']} style={styles.container}>
      <View style={styles.header}>
        <Svg height="50" width="50">
          <Circle
            cx="25"
            cy="25"
            r="20"
            stroke="#E64A19"
            strokeWidth="5"
            fill="none"
            strokeDasharray={`${(timer / 10) * 100} ${100}`}
          />
        </Svg>
        <Text style={styles.timerText}>{timer} seconds</Text>
      </View>

      <View style={styles.centeredContainer}>
        {gameStarted ? (
          <>
            <Text style={styles.title}>QUESTION {currentQuestionIndex + 1}</Text>
            <View style={styles.questionContainer}>
              <Text style={styles.question}>{currentQuestion.gamequestion}</Text>
            </View>

            <View style={styles.optionsContainer}>
              <TouchableOpacity style={styles.optionButton} onPress={() => handleAnswer('A')}>
                <Text style={styles.optionText}>A) {currentQuestion.option_a}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionButton} onPress={() => handleAnswer('B')}>
                <Text style={styles.optionText}>B) {currentQuestion.option_b}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionButton} onPress={() => handleAnswer('C')}>
                <Text style={styles.optionText}>C) {currentQuestion.option_c}</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.gameInfoContainer}>
            <Text style={styles.gameInfoText}>Welcome to the Game!</Text>
            <Text style={styles.gameInfoText}>Answer the questions correctly to earn points.</Text>
            <TouchableOpacity style={styles.startButton} onPress={() => setGameStarted(true)}>
              <Text style={styles.buttonText}>Start Answering</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Bottom Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('Home')}>
          <FontAwesome name="list-alt" size={24} color="black" />
          <Text style={styles.tabText}>Feed</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('Inbox')}>
          <FontAwesome name="envelope" size={24} color="black" />
          <Text style={styles.tabText}>Inbox</Text>
        </TouchableOpacity>

        <View style={styles.alertButtonContainer}>
          <TouchableOpacity style={styles.alertButton} onPress={() => navigation.navigate('Alert')}>
            <FontAwesome name="exclamation-circle" size={40} color="white" />
          </TouchableOpacity>
          <Text style={styles.alertButtonText}>ALERT</Text>
        </View>

        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('Games')}>
          <FontAwesome name="gamepad" size={30} color='#E64A19' />
          <Text style={styles.tabText}>Games</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('Profile')}>
          <FontAwesome name="user" size={24} color="black" />
          <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  timerText: {
    fontSize: 16,
    color: '#E64A19',
    marginLeft: 10,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  questionContainer: {
    backgroundColor: '#c0392b',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  question: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  optionsContainer: {
    marginTop: 20,
    width: '90%',
  },
  optionButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  optionText: {
    fontSize: 16,
  },
  gameInfoContainer: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#c0392b',
    width: '90%',
  },
  gameInfoText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#32CD32',
    padding: 15,
    borderRadius: 10,
  },
  endGameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  endGameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  badgeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 10,
  },
  badgeName: {
    fontSize: 20,
    color: '#fff',
    marginVertical: 10,
  },
  endGamePoints: {
    fontSize: 18,
    color: '#fff',
    marginVertical: 20,
  },
  restartButton: {
    backgroundColor: '#32CD32',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    backgroundColor: '#FFF3E0',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  tabButton: {
    alignItems: 'center',
  },
  alertButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  alertButton: {
    width: 70,
    height: 70,
    backgroundColor: '#E64A19',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
    position: 'absolute',
    bottom: 30,
    zIndex: 10,
  },
  alertButtonText: {
    fontSize: 12,
    color: 'black',
    marginTop: 5,
  },
  tabText: {
    fontSize: 12,
    color: 'black',
    marginTop: 5,
  },
});

export default GamesScreen;
