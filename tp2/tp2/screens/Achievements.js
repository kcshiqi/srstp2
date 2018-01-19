//Landing page
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Picker,
  Modal,
} from 'react-native';
import { MonoText } from '../components/StyledText';
import {
  Card,
  ButtonGroup,
  Tile,
  Grid,
  Col,
  Row,
  Icon,
  List,
  ListItem,
  Avatar
} from 'react-native-elements/src';
import { Bar, Pie } from 'react-native-pathjs-charts'
import { FontAwesome } from '@expo/vector-icons';
import {  VictoryLegend, VictoryPie, VictoryAxis, VictoryBar, VictoryChart, VictoryStack, VictoryTheme, VictoryLine, VictoryLabel} from "victory-native";


const summaryList = [
  {
    name: 'Total Expenses',
    data: '$423.00',
  },
  {
    name: 'Total Income',
    data: '$346.00',
  },
  {
    name: 'Period Balance',
    data: '-$77.00',
  },
  {
    name: 'Cumulative Balance',
    data: '$352.00',
  },
];



export default class Achievements extends React.Component {

  static navigationOptions = {
    drawerLabel: 'Achievements',
    drawerIcon: ({ tintColor }) => (
    <MaterialIcons name="star" size={24} style={{ color: tintColor }} />
  ),
  };

  render() {
    return (

<Image source={require('../assets/images/bg.jpg')} style={styles.backgroundImage}>
        <ScrollView
          style={styles.container}>

        <View style={styles.headerContainer}>

          <FontAwesome color="#84D3EB" style={{backgroundColor:'transparent'}} name="trophy" size={62} />
          <Text style={styles.heading}>Achievements</Text>
        </View>

          <Card title="SUMMARY FOR THIS MONTH" fontFamily='space-mono' fontSize='25' borderColor='#84D3EB' borderRadius='25'>
            <List 
                  borderTopWidth= '0'>
              {summaryList.map((l, i) => (
                <ListItem
                hideChevron
                  key={i}
                  title={l.name}
                  subtitle={l.data}
                  fontFamily='space-mono'
                  borderBottomWidth= '0'
                  borderTopWidth= '0'
                  subtitleStyle={{textAlign:'right'}}
                  titleStyle={{fontWeight:'bold'}}
                />
              ))}
            </List>
          </Card>

          <Card title="CATEGORY" fontFamily='space-mono' fontSize='25' borderColor='#84D3EB' borderRadius='25'>
<Text style={styles.chartTitle}>Expenses by Category for this Month</Text>

<VictoryPie
  colorScale={["teal", "cyan", "tomato" ]}
  data={[
    { x: 35+'%', y: 35 },
    { x: 40+'%', y: 40 },
    { x: 55+'%', y: 55 }
  ]}
/><VictoryLegend
  colorScale={["teal", "cyan", "tomato" ]}
  data={[
    {name: 'Food', symbol: { type: 'square', color:'teal' }},
    {name: 'Healthcare', symbol: { type: 'square'}},
    {name: 'Entertainment', symbol: { type: 'square'}}
    ]}
/>
<Text style={styles.cardBody}>Note: Cut down on spending in the entertainment category</Text>
          </Card>

          <Card title="ANALYSIS" fontFamily='Raleway' fontSize='25' borderColor='#84D3EB' borderRadius='25'>

<Text style={styles.chartTitle}>Expenses Over the Past 6 Months</Text>
  <VictoryChart
  theme={VictoryTheme.material}
    domainPadding={40}
>

  <VictoryLine labels={(datum) => '$'+datum.y}
  labelComponent={<VictoryLabel renderInPortal dy={-20}/>}
    style={{
      data: { stroke: "#c43a31" },
      parent: { border: "1px solid #ccc"}
    }}
    data={[
      { x: 'Feb', y: 1004 },
      { x: 'Mar', y: 804 },
      { x: 'Apr', y: 350 },
      { x: 'May', y: 400 },
      { x: 'Jun', y: 950 },
      { x: 'Jul', y: 423 },
    ]}

  />
</VictoryChart>

<Text style={styles.cardBody}>Highest Expenditure: <Text style={{textDecorationLine:'underline', color:'teal'}}>$1004</Text> in <Text style={{fontWeight:'bold'}}>February</Text></Text>
<Text style={styles.cardBody}>Lowest Expenditure: <Text style={{textDecorationLine:'underline', color:'teal'}}>$350</Text> in <Text style={{fontWeight:'bold'}}>April</Text></Text>
<Text style={styles.cardBody}>View Expenses by Category for: </Text>

          </Card>

        </ScrollView>
        </Image>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    //backgroundColor: '#5e08dd',
    //backgroundColor: '#9dc0f9',
  },
  heading: {
    color: '#58585B',
    marginTop: 10,
    fontSize: 22,
    fontFamily: 'space-mono',
    backgroundColor: 'transparent',
  },
  chartTitle: {
    color: '#58585B',
    fontSize: 18,
    fontFamily: 'space-mono',
    backgroundColor: 'transparent',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  cardBody: {
    color: '#58585B',
    fontSize: 16,
    fontFamily: 'space-mono',
    backgroundColor: 'transparent',
    textAlign: 'left',
  },
  contentContainer: {
    paddingTop: 80,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 23,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: null,
    height: null,
  },
});
