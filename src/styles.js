import styled, { css } from 'styled-components/native';
import { Animated, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import logoSrc from './assets/Logo.png';
const widthScreen = Dimensions.get('window').width;

export const Container = styled.View`
  flex: 1;
  background: #FFF;
  padding: 10px;
`;

export const Logo = styled.Image.attrs({ source: logoSrc })`
  width: 75px;
  height: 40px;
  resize-mode: contain;
  margin-bottom: 20px;
`;

export const ContainerHeader = styled.View`
  align-self: stretch;
  background: #ffffff;
  padding-bottom: 5px;
`;

export const ContainerAnimated = styled(Animated.View)`
  position: absolute;
  z-index: 1000;
  left: 10px;
  right: 10px;
  top: 10px;
`;

export const ContainerInput = styled.View`
  align-self: stretch;
  height: 45px;
  background: #EEE;
  border-radius: 4px;
  flex-direction: row;
  align-items: center;
  padding-right: 10px;
`;

export const Input = styled.TextInput`
  flex: 1;
  border-radius: 4px;
  padding-left: 10px;
  font-size: 16px;
  color: #000;
`;

export const ContainerMessage = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-top: 110px;
`;

export const TextMessage = styled.Text`
  color: #AAA;
  font-size: 16px;
  text-align: center;
`;

export const List = styled.FlatList`
  flex: 1;
  margin-top: 50px;
  padding-top: 60px;
`;

export const LoadingFooter = styled.ActivityIndicator.attrs({ size: 25, color: '#CCC' })`
   margin-bottom: 60px;
`;

export const Image = styled.Image`
  width: 100%;
  height: 150px;
  margin-bottom: 8px;
  background: #EEE;

  ${props => props.withMarginBottom && css`
    margin-bottom: 20px;
  `};

  ${props => props.isImageModal && css`
    margin-bottom: 0px;
    height: 400px;
    width: ${widthScreen}px;
    background: #FFF;
  `};
`;

export const Press = styled.TouchableOpacity`

`;

export const ContainerModal = styled.View`
  flex: 1;
  background: #FFF;
  align-items: center;
  justify-content: center;
`;

export const CloseModal = styled(Icon).attrs({ name: 'close', size: 40, color: '#333' })`
  position: absolute;
  right: 15px;
  top: 15px;
  padding: 5px;
`;

export const DownloadImage = styled(Icon).attrs({ name: 'file-download', size: 40, color: '#333' })`
  position: absolute;
  left: 15px;
  top: 15px;
  padding: 5px;
`;

export const LoadingDownload = styled.ActivityIndicator.attrs({ size: 30, color: '#333' })`
  position: absolute;
  left: 25px;
  top: 25px;
`;
