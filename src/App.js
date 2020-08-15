import React, { useState, useEffect } from 'react';
import { StatusBar, Alert, Animated, Modal, PermissionsAndroid, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNFetchBlob from 'rn-fetch-blob';
import { KEY_GIPHY, BASE_URL } from './config';
import { simpleHash } from './utils';
import {
  Container, Logo, ContainerInput, Input, ContainerMessage, TextMessage, ContainerModal, CloseModal,
  ContainerHeader, List, Image, ContainerAnimated, LoadingFooter, Press, DownloadImage, LoadingDownload
} from './styles';

const App = () => {

  const scrollY = new Animated.Value(0);
  const diffClampScrollY = Animated.diffClamp(scrollY, 0, 60);
  const headerY = diffClampScrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [0, -60]
  });

  const [search, setSearch] = useState('');
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState('general');
  const [page, setPage] = useState(1);
  const [viewGif, setViewGif] = useState('');

  useEffect(() => {
    (async () => {
      await loadPage();
      setLoading('');
    })();
  }, []);

  const loadPage = async (pageToLoad = 1, cleanOldGifs = true, ignoreSearch = false) => {
    try {
      const offset = (pageToLoad - 1) * 10;
      const url = search && !ignoreSearch ? `${BASE_URL}/search?api_key=${KEY_GIPHY}&offset=${offset}&limit=10&q=${search}` : `${BASE_URL}/trending?api_key=${KEY_GIPHY}&offset=${offset}&limit=10`;
      const gifsUnformatted = await fetch(url);
      const { data } = await gifsUnformatted.json();
      const gifsReduced = data.map(gif => ({ uri: gif.images.fixed_height_downsampled.url, id: gif.id }));
      cleanOldGifs ? setGifs([...gifsReduced]) : setGifs([...gifs, ...gifsReduced]);
      setPage(pageToLoad);
    } catch (error) {
      Alert.alert('Erro ao buscar Gifs', error.toString());
    }
  };

  const handleSearch = async () => {
    setLoading('general');
    await loadPage(1);
    setLoading('');
  };

  const handleLoadMore = () => {
    loadPage(page + 1, false);
  };

  const downloadGif = () => {
    setLoading('download');
    const dirs = RNFetchBlob.fs.dirs;
    RNFetchBlob.config({
      path: dirs.DownloadDir + `/${simpleHash()}.gif`,
      fileCache: true
    }).fetch(
      'GET',
      viewGif
    ).then(() => {
      ToastAndroid.show('Gif salvo na pasta de Downloads', ToastAndroid.SHORT);
      setLoading('');
    }).catch(() => {
      ToastAndroid.show('Ocorreu um erro ao salvar o Gif', ToastAndroid.SHORT);
      setLoading('');
    });
  };

  const downloadFile = async () => {
    if (loading === 'download') return;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Acesso ao armazenamento',
          message: 'O App necessita de memória para realizar download do arquivo'
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) return downloadGif();
      Alert.alert('Permissão negada', 'Necessário permitir o acesso para realizar downloads');
    } catch (err) {
      Alert.alert('Erro ao realizar download do gif', err.toString());
    }
  }

  return (
    <Container>
      <StatusBar backgroundColor='#FFF' barStyle='dark-content' />
      <Modal animated animationType='fade' transparent visible={!!viewGif} backdropColor='transparent'>
        <ContainerModal>
          <CloseModal onPress={() => setViewGif('')} />
          <Image
            isImageModal
            resizeMode='contain'
            source={{ uri: viewGif }}
          />
          {
            loading !== 'download' &&
            <DownloadImage onPress={downloadFile} />
          }
          {
            loading === 'download' &&
            <LoadingDownload />
          }
        </ContainerModal>
      </Modal>
      <ContainerAnimated
        style={{
          transform: [{ translateY: headerY }]
        }}
      >
        <ContainerHeader>
          <Logo />
          <ContainerInput>
            <Input
              placeholder='Procurar mais gifs...'
              placeholderTextColor='#AAA'
              value={search}
              onChangeText={(value) => setSearch(value)}
              returnKeyType='search'
              onSubmitEditing={handleSearch}
            />
            {
              !!search &&
              <Icon
                name='close'
                size={25}
                color='#AAA'
                onPress={async () => {
                  setSearch('');
                  loadPage(1, true, true);
                }}
              />
            }
            {
              !search &&
              <Icon
                name='search'
                size={25}
                color='#AAA'
              />
            }
          </ContainerInput>
        </ContainerHeader>
      </ContainerAnimated>
      {
        (!gifs.length && loading !== 'general') &&
        <ContainerMessage>
          <TextMessage>Não há itens para apresentar</TextMessage>
        </ContainerMessage>
      }
      {
        (!!gifs.length && loading !== 'general') &&
        <List
          onScroll={(event) => scrollY.setValue(event.nativeEvent.contentOffset.y)}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<LoadingFooter />}
          onEndReachedThreshold={0.2}
          onEndReached={handleLoadMore}
          keyExtractor={item => item.id}
          data={gifs}
          renderItem={({ item, index }) => (
            <Press onPress={() => setViewGif(item.uri)}>
              <Image
                withMarginBottom={index === gifs.length - 1}
                resizeMode='cover'
                source={{ uri: item.uri }}
              />
            </Press>
          )}
        />
      }
      {
        (loading === 'general') &&
        <ContainerMessage>
          <TextMessage>Buscando...</TextMessage>
        </ContainerMessage>
      }
    </Container>
  );
}

export default App;
