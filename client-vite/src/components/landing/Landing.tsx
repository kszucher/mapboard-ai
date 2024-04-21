import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {FC, useEffect, useState} from "react"
import {useAuth0} from "@auth0/auth0-react"
import {api} from "../../api/Api.ts"
import {authAudienceUrl} from "../../api/Urls"
import {setColors} from "../assets/Colors"
import {Spinner} from "../assets/Spinner"
import {Button, Theme} from "@radix-ui/themes"
import TopologyStar from "../../assets/topology-star.svg?react"
import Login from "../../assets/login.svg?react"

export const Landing: FC = () => {
  const colorMode = 'dark'
  const token = useSelector((state: RootState) => state.editor.token)
  const [isWaiting, setIsWaiting] = useState(false)
  const { loginWithRedirect, getAccessTokenSilently } = useAuth0()
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    setColors(colorMode)
    document.documentElement.classList.add('dark')
  }, [])

  useEffect(() => {
    (async () => {
      try {
        setIsWaiting(true)
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: authAudienceUrl,
            scope: 'openid profile email',
          },
        })
        dispatch(actions.setToken(token))
      } catch (e) {
        setIsWaiting(false)
        console.error(e)
      }
    })()
  }, [getAccessTokenSilently])

  useEffect(()=> {
    if (token !== '') {
      dispatch(api.endpoints.signIn.initiate())
    }
  }, [token])

  return (
    <Theme accentColor="violet" panelBackground="solid" scaling="100%" radius="full">
      <main className="flex h-screen items-center justify-center bg-zinc-800">
        <div className="container flex max-w-[64rem] flex-col items-center gap-8 text-center">
          <TopologyStar className="h-16 w-16"/>
          <div className=" font-semibold md:text-6xl lg:text-6xl	">
            {'mapboard'}
          </div>
          <div className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            {'visual process mapping with ai'}
          </div>
          <div className="min-h-0">
            {isWaiting && <Spinner/>}
            {!isWaiting &&
              <Button onClick={() => loginWithRedirect()}>
                <Login/>
                Login
              </Button>
            }
          </div>
          <div className="flex gap-2">
          </div>
        </div>
      </main>
    </Theme>
  )
}
