import React from 'react';
import { StyleSheet, View } from 'react-native';
import StudyStatusTodoMyEmpty from './StudyStatusTodoMyEmpty';
import StudyStatusTodoMyFilled from './StudyStatusTodoMyFilled';
import StudyStatusTodoOthers from './StudyStatusTodoOthers';

function StudyStatusTodo() {
  const hasMyTodos = true;

  return (
    <View style={styles.container}>
      {hasMyTodos ? <StudyStatusTodoMyFilled /> : <StudyStatusTodoMyEmpty />}
      <StudyStatusTodoOthers />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
});

export default StudyStatusTodo;
