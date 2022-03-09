using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Diagnostics;
using System.Windows;
using System.Diagnostics;
using System.IO;
using System.Text.Json;
using System.Collections.ObjectModel;

namespace _2DGame_Online
{

    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        int Syn = 1;
        int Ope = 1;
        int Col = 1;
        public MainWindow()
        {
            InitializeComponent();
        }

        class Data
        {
            public int user_setx { get; set; }
            public int user_sety { get; set; }
            public int sizew { get; set; }
            public int sizeh { get; set; }
            public int ava_type { get; set; }
            public int fps { get; set; }
            public int block_size { get; set; }
            public int limit_time { get; set; }
            public int Genre { get; set; }
            public int user_collision { get; set; }
            public int synchro_frec { get; set; }
            public int item_size { get; set; }
            public double max_spead { get; set; }
            public double jump_pow { get; set; }
            public double rotation { get; set; }
            public double friction { get; set; }
            public double gravity { get; set; }
            public int max_move { get; set; }
            public string keycode_up { get; set; }
            public string keycode_do { get; set; }
            public string keycode_le { get; set; }
            public string keycode_ri { get; set; }
            public string item_point { get; set; }
            public int port { get; set; }
            public int item { get; set; }
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            Data data = new Data();

            data.user_setx = int.Parse(SetX.Text);
            data.user_sety = int.Parse(SetY.Text);
            data.sizew = int.Parse(bs.Text);
            data.sizeh = int.Parse(bs.Text);
            data.ava_type = 0;
            data.fps = int.Parse(FPS.Text);
            data.block_size = int.Parse(bs.Text);
            data.limit_time = int.Parse(time.Text);
            data.Genre = Ope;
            data.user_collision = Col;
            data.synchro_frec = int.Parse(sf.Text);
            data.item_size = int.Parse(IS.Text);
            data.max_spead = double.Parse(ms.Text);
            data.jump_pow = double.Parse(jp.Text);
            data.rotation = double.Parse(rp.Text);
            data.friction = double.Parse(fr.Text);
            data.gravity = double.Parse(gp.Text);
            data.max_move = int.Parse(mm.Text);
            data.keycode_up = Kup.Text;
            data.keycode_do = Kdown.Text;
            data.keycode_le = Kleft.Text;
            data.keycode_ri = Kright.Text;
            data.port = int.Parse(port.Text);
            data.item = int.Parse(item.Text);
            string jsonStr = JsonSerializer.Serialize(data);
            Console.WriteLine(jsonStr);
            File.WriteAllText(@"data.json",jsonStr);

            MessageBox.Show("設定を行いました\n サーバを起動します");

            Process p = new Process();

            if(Syn == 1)
            {
                p.StartInfo.FileName = "Server.bat";
            }
            else
            {
                p.StartInfo.FileName = "Client.bat";
            }
            p.StartInfo.Arguments = "test1 test2 test3";
            p.StartInfo.Verb = "RunAs"; //管理者として実行する場合

            p.Start();
            MessageBox.Show("ローカル上でサーバを起動しました\nhttp://localhost:" + port.Text+"");
        }

        private void Server_Click(object sender, RoutedEventArgs e)
        {
            Syn = 1;
        }

        private void Client_Click(object sender, RoutedEventArgs e)
        {
            Syn = 2;
        }

        private void Action_Click(object sender, RoutedEventArgs e)
        {
            Ope = 1;
        }

        private void Shooting_Click(object sender, RoutedEventArgs e)
        {
            Ope = 2;
        }

        private void Race_Click(object sender, RoutedEventArgs e)
        {
            Ope = 3;
        }
        private void True_Click(object sender, RoutedEventArgs e)
        {
            Col = 1;
        }
        private void False_Click(object sender, RoutedEventArgs e)
        {
            Col = 2;
        }
    }
}
