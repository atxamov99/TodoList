import React, { useReducer, useEffect, useRef } from 'react'

const initialState = {
  todos: [],
  input: "",
  filter: "all",
  editingIndex: null,
};

function init(initial) {
  try {
    const raw = localStorage.getItem('todosApp_v1')
    if (raw) {
      return JSON.parse(raw)
    }
  } catch {
    // ignore parse errors
  }
  return initial
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_INPUT':
      return { ...state, input: action.payload }
    case 'ADD': {
      if (state.input.trim() === '') return state
      const newTodo = {
        id: Date.now(),
        text: state.input.trim(),
        done: false,
        createdAt: Date.now(),
      }
      return { ...state, todos: [...state.todos, newTodo], input: '' }
    }
    case 'DELETE':
      return { ...state, todos: state.todos.filter((_, i) => i !== action.payload) }
    case 'TOGGLE':
      return {
        ...state,
        todos: state.todos.map((todo, i) => (i === action.payload ? { ...todo, done: !todo.done } : todo)),
      }
    case 'EDIT_START':
      return { ...state, editingIndex: action.payload, input: state.todos[action.payload]?.text ?? '' }
    case 'EDIT_CANCEL':
      return { ...state, editingIndex: null, input: '' }
    case 'EDIT_SAVE': {
      const idx = state.editingIndex
      if (idx === null) return state
      if (state.input.trim() === '') return state
      const todos = state.todos.slice()
      todos[idx] = { ...todos[idx], text: state.input.trim() }
      return { ...state, todos, editingIndex: null, input: '' }
    }
    case 'CLEAR_COMPLETED':
      return { ...state, todos: state.todos.filter((t) => !t.done) }
    case 'SET_FILTER':
      return { ...state, filter: action.payload }
    default:
      return state
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState, init)
  const inputRef = useRef(null)

  useEffect(() => {
    try {
      localStorage.setItem('todosApp_v1', JSON.stringify(state))
    } catch {
      // ignore storage errors
    }
  }, [state])

  const visibleTodos = state.todos.filter((t) => {
    if (state.filter === 'active') return !t.done
    if (state.filter === 'completed') return t.done
    return true
  })

  const remaining = state.todos.filter((t) => !t.done).length

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-800 to-purple-700 p-6">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-2xl p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">✅ To‑Do (useReducer)</h1>

        <div className="mb-4">
          <div className="flex shadow-sm rounded-lg overflow-hidden">
            <input
              ref={inputRef}
              type="text"
              value={state.input}
              onChange={(e) => dispatch({ type: 'SET_INPUT', payload: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (state.editingIndex === null) dispatch({ type: 'ADD' })
                  else dispatch({ type: 'EDIT_SAVE' })
                } else if (e.key === 'Escape') {
                  dispatch({ type: 'EDIT_CANCEL' })
                }
              }}
              placeholder="Vazifa yozing..."
              className="flex-1 px-4 py-2 outline-none"
            />
            <button
              onClick={() => (state.editingIndex === null ? dispatch({ type: 'ADD' }) : dispatch({ type: 'EDIT_SAVE' }))}
              className="bg-purple-600 text-white px-4 hover:bg-purple-700"
            >
              {state.editingIndex === null ? 'Qo‘shish' : 'Saqlash'}
            </button>
            {state.editingIndex !== null && (
              <button
                onClick={() => dispatch({ type: 'EDIT_CANCEL' })}
                className="bg-gray-100 px-4 hover:bg-gray-200"
              >
                Bekor
              </button>
            )}
          </div>
          <div className="text-sm text-gray-200 mt-2 flex justify-between">
            <span className="text-xs text-gray-200">{remaining} ta vazifa qolgan</span>
            <div className="space-x-2">
              <button
                onClick={() => dispatch({ type: 'SET_FILTER', payload: 'all' })}
                className={`px-2 py-1 rounded ${state.filter === 'all' ? 'bg-white text-gray-800' : 'text-white/70'}`}
              >
                Hammasi
              </button>
              <button
                onClick={() => dispatch({ type: 'SET_FILTER', payload: 'active' })}
                className={`px-2 py-1 rounded ${state.filter === 'active' ? 'bg-white text-gray-800' : 'text-white/70'}`}
              >
                Aktiv
              </button>
              <button
                onClick={() => dispatch({ type: 'SET_FILTER', payload: 'completed' })}
                className={`px-2 py-1 rounded ${state.filter === 'completed' ? 'bg-white text-gray-800' : 'text-white/70'}`}
              >
                Tugallangan
              </button>
            </div>
          </div>
        </div>

        <ul className="space-y-3">
          {visibleTodos.length === 0 && (
            <li className="text-center text-gray-300">Ro'yxat bo'sh</li>
          )}
          {visibleTodos.map((todo) => {
            const originalIndex = state.todos.indexOf(todo)
            return (
              <li
                key={todo.id}
                className={`flex items-center justify-between p-3 rounded-lg shadow-sm ${
                  todo.done ? 'bg-green-50' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={todo.done}
                    onChange={() => dispatch({ type: 'TOGGLE', payload: originalIndex })}
                    className="w-5 h-5"
                  />
                  <span
                    onDoubleClick={() => dispatch({ type: 'EDIT_START', payload: originalIndex })}
                    className={`select-none ${todo.done ? 'line-through text-gray-400' : ''}`}
                  >
                    {todo.text}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => dispatch({ type: 'EDIT_START', payload: originalIndex })}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Tahrir
                  </button>
                  <button
                    onClick={() => dispatch({ type: 'DELETE', payload: originalIndex })}
                    className="text-red-500 hover:text-red-700"
                    aria-label="O'chirish"
                  >
                    ❌
                  </button>
                </div>
              </li>
            )
          })}
        </ul>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-300">Jami: {state.todos.length}</div>
          <div className="flex gap-2">
            <button
              onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })}
              className="text-sm px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
            >
              Tugallanganlarni tozalash
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}