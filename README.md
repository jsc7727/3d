# BoxMove1

state를 threejs 컴포넌트에 바로 연결하면
매번 입력받을 때마다 리렌더링됨

state 변경값을 useRef를 통해 dom에 직접 접근해 업데이트하면
리렌더링을 막을 수 있음

<br>

# BoxMove2

방향키를 누르면 잠깐 딜레이가 있는데

눌렀을때 해당 방향으로 이동하는 것이 아닌,

방향키가 눌렸을때 해당 방향의 speed를 올려주고,

useFrame을 사용해 delta 에 따라 해당방향으로 speed 만큼 position을 이동한다

### delta는 프레임과 프레임 사이의 간격을 의미한다.

### delta = [현재 렌더링된 상태의 시간 - 이전 렌더링된 상태의 시간]

<br>

# BoxMove3

## 그럼 이제 점프는 어떻게 할까?

점프도 이동이랑 그렇게 다르지 않다

`s = (vt + 1/2 * a * t^2)` === `s = (v+(a/2)t)t)`
s = 현재속도
v = 초속
t = 시간
a = 가속도(중력, 저항 ...)

```javascript
jumpSpeed.current -= (defaultJumpSpeed + (9.8 / 2) * delta) * delta;
```

# 카메라?

## 카메라도 연동해야한다.

useFrame({camera})로 카메라를 받아온 다음
box 위치에서 y축과 z축에 값을 더해주고
해당 값을 camera.position이랑 매칭해준다.

camera.rotation의 값을 주어
살짝 아래를 보게 해준다.

rotation 값을 설정할때 Math.PI = 3.14 = 360도 로 생각하면된다.
예를들어 45도를 사용하고 싶다면 `Math.PI * 45 / 360`을 하면 된다.

```javascript
camera.position.x = myMesh.current.position.x;
camera.position.y = myMesh.current.position.y + 5;
camera.position.z = myMesh.current.position.z + 5;
camera.rotation.x = (-Math.PI * 100) / 360;
```
