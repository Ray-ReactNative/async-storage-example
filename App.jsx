import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import sortBy from 'lodash/sortBy';
import Icon from 'react-native-vector-icons/MaterialIcons';
import '../AsyncStoragePractice/Storage';

const COLORS = {
  primary: '#1f145c',
  white: '#fff',
  gray: '#eeeaea',
  lightGray: '#f5efef',
};

const App = () => {
  const [todos, setTodos] = useState([]);
  const [textInput, setTextInput] = useState('');

  //add todo item
  const addTodo = () => {
    if (textInput.trim().length === 0) {
      Alert.alert('嘿', '請輸入文字');
    } else {
      const newTodo = {
        id: Math.random(),
        task: textInput,
        completed: false,
        time: new Date(),
      };
      setTodos([...todos, newTodo]);
      setTextInput('');
    }
  };

  // edit todo item (comleted: false -> true)
  const markTodoItemCompleted = todoId => {
    const newTodosItem = todos.map(item => {
      if (item.id === todoId) {
        if (!item.completed) {
          return {...item, completed: true};
        }
        if (item.completed) {
          return {...item, completed: false};
        }
      }
      return item;
    });
    setTodos(newTodosItem);
  };

  // delete todo item
  const deleteTodo = todoId => {
    const newTodosItem = todos.filter(item => item.id !== todoId);
    setTodos(newTodosItem);
  };

  // clear todo list
  const clearAllTodos = () => {
    Alert.alert('Confirm', 'Clear todos?', [
      {
        text: 'Yes',
        onPress: () => setTodos([]),
      },
      {
        text: 'No',
      },
    ]);
  };

  // get data from device
  const getTodosFromDevice = async () => {
    try {
      // const todosList = await AsyncStorage.getItem('todos');
      global.storage
        .load({
          key: 'todos',
          id: 'todos',
        })
        .then(data => {
          // 如果找到数据，则在then方法中返回
          // 注意：这是异步返回的结果（不了解异步请自行搜索学习）
          // 你只能在then这个方法内继续处理ret数据
          // 而不能在then以外处理
          // 也没有办法“变成”同步返回
          // 你也可以使用“看似”同步的async/await语法

          // console.log(ret);
          setTodos(data);
        });
    } catch (error) {
      console.log('Failed to load todos', error);
    }
  };

  const saveTodosToUserDevice = async todos => {
    try {
      // const stringifyTodos = JSON.stringify(todos);
      // await AsyncStorage.setItem('todos', stringifyTodos);
      await global.storage.save({
        key: 'todos',
        id: 'todos',
        data: todos,
      });
      console.log('Todos successfully saved:', todos);
    } catch (error) {
      console.log('Failed to save todos', error);
    }
  };

  const getSortedState = data => sortBy(data, ['completed', 'time']);
  // const getSortedState = data =>
  //   data.sort((a, b) =>
  //     a.completed === b.completed ? a.time - b.time : a.completed ? 1 : -1,
  //   );

  const ListItem = ({todo}) => {
    return (
      <View style={styles.listItem}>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 15,
              color: COLORS.primary,
              textDecorationLine: todo?.completed ? 'line-through' : 'none',
            }}>
            {todo?.task}
          </Text>
        </View>
        <TouchableOpacity onPress={() => markTodoItemCompleted(todo.id)}>
          <View
            style={[
              styles.actionIcon,
              {backgroundColor: todo?.completed ? '#aaaaaa' : 'green'},
            ]}>
            <Icon name="done" size={20} color="white" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
          <View style={styles.actionIcon}>
            <Icon name="delete" size={25} color="gray" />
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  useEffect(() => {
    getTodosFromDevice();
  }, []);

  useEffect(() => {
    saveTodosToUserDevice(todos);
  }, [todos]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <View style={styles.header}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 20,
            color: COLORS.primary,
          }}>
          TODO APP
        </Text>
        <Icon name="delete" size={25} color="red" onPress={clearAllTodos} />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 20, paddingBottom: 100}}
        data={getSortedState(todos)}
        renderItem={({item}) => <ListItem todo={item} />}
      />

      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput
            value={textInput}
            placeholder="Add Todo"
            onChangeText={text => setTextInput(text)}
          />
        </View>
        <TouchableOpacity onPress={addTodo}>
          <View style={styles.iconContainer}>
            <Icon name="add" color="white" size={30} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
  },
  inputContainer: {
    height: 50,
    paddingHorizontal: 20,
    elevation: 40,
    backgroundColor: COLORS.lightGray,
    flex: 1,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 15,
    justifyContent: 'center',
  },
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    elevation: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  listItem: {
    padding: 20,
    backgroundColor: COLORS.gray,
    shadowColor: COLORS.primary,
    shadowOffset: {width: 10, height: 10},
    flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
  },
  actionIcon: {
    height: 25,
    width: 25,
    // backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderRadius: 3,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
