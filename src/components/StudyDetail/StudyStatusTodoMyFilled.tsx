import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../../styles/colors';

const mascotImage = require('../../assets/character/ch_2.png');
const vectorIcon = require('../../assets/icon/vector_icon.png');

const initialTodos = [
  { id: 1, label: '영단어 10개 외우기', checked: true },
  { id: 2, label: '영단어 10개 외우기', checked: false },
  { id: 3, label: '영단어 10개 외우기', checked: false },
];

function StudyStatusTodoMyFilled() {
  const [todos, setTodos] = useState(initialTodos);
  const [showInput, setShowInput] = useState(false);
  const [draft, setDraft] = useState('');

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, checked: !todo.checked } : todo)),
    );
  };

  const handleSubmit = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setTodos((prev) => [...prev, { id: Date.now(), label: trimmed, checked: false }]);
    setDraft('');
    setShowInput(false);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>나의 TODO</Text>
      <View style={styles.contentRow}>
        <View style={styles.todoList}>
          {todos.map((todo) => (
            <View key={todo.id} style={styles.todoRow}>
              <Pressable
                style={[styles.check, todo.checked && styles.checkActive]}
                onPress={() => toggleTodo(todo.id)}
              >
                {todo.checked && <Image source={vectorIcon} style={styles.checkIcon} />}
              </Pressable>
              <Text style={[styles.todoText, todo.checked && styles.todoTextChecked]}>
                {todo.label}
              </Text>
            </View>
          ))}
          {showInput && (
            <View style={styles.todoRow}>
              <View style={styles.check} />
              <TextInput
                value={draft}
                onChangeText={setDraft}
                onSubmitEditing={handleSubmit}
                placeholder="새로운 TODO 입력"
                placeholderTextColor="#B0B0B0"
                style={styles.todoInput}
                returnKeyType="done"
              />
            </View>
          )}
        </View>
        <Image source={mascotImage} style={styles.mascot} resizeMode="contain" />
      </View>
      <Pressable style={styles.addButton} onPress={() => setShowInput(true)}>
        <Text style={styles.addText}>+ 추가하기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  todoList: {
    flex: 1,
  },
  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  check: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#C8C8C8',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  checkIcon: {
    width: 9,
    height: 7,
    tintColor: '#FFFFFF',
  },
  todoText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  todoTextChecked: {
    textDecorationLine: 'line-through',
  },
  todoInput: {
    flex: 1,
    fontSize: 12,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  mascot: {
    width: 86,
    height: 86,
  },
  addButton: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  addText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
  },
});

export default StudyStatusTodoMyFilled;
