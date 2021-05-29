// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {
  fetchPokemon,
  PokemonForm,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: pokemonName ? 'pending' : 'idle',
    pokemon: null,
    error: null,
  })
  const {status, pokemon, error} = state

  React.useEffect(() => {
    if (!pokemonName) return
    setState({status: 'pending'})

    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setState({status: 'resolved', pokemon: pokemonData})
      })
      .catch(err => {
        setState({status: 'rejected', error: err})
      })
  }, [pokemonName])

  switch (status) {
    case 'rejected':
      throw error
    case 'resolved':
      return <PokemonDataView pokemon={pokemon} />
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    case 'idle':
    default:
      return 'Submit a pokemon'
  }
}

// class ErrorBoundary extends React.Component {
//   state = {error: null}

//   static getDerivedStateFromError(error) {
//     return {error}
//   }

//   render() {
//     const error = this.state.error
//     if (error) {
//       return (
//         <div role="alert">
//           There was an error:{' '}
//           <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
//         </div>
//       )
//     }
//     return this.props.children
//   }
// }

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => setPokemonName('')}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
