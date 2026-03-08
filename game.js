/**
 * CBmáFia - O Jogo da Justiça Divina
 * Estilo: Pixel 3D
 */

class CBmaFiaGame {
    constructor() {
        this.state = 'MENU'; // MENU, PLAYING, VAR, PAUSE
        this.team = 'VARMENGO'; // VARMENGO, VARMEIRAS
        this.scorePlayer = 99;
        this.scoreAdv = 0;
        this.matchTime = 120; // 2 minutos

        this.satireTexts = [
            "CBF: Onde o futebol é secundário e o lucro é primário.",
            "Varmengo: Transformando o impossível em pênalti desde 1980.",
            "Varmeiras: Porque ter um pacto é bom, mas ter o VAR é melhor.",
            "Justiça Divina: O apito só erra quando é contra a gente.",
            "VAR: A ferramenta perfeita para confirmar o que já decidimos.",
            "CBmáFia: A única máfia que você pode torcer (ou não).",
            "Palmeiras não tem mundial, mas tem sistema.",
            "O Flamengo não joga contra 11, joga pelo sistema.",
            "CBF: Confederação Brasileira de Falcatruas",
            "Onde o regulamento é apenas uma sugestão.",
            "Ednaldo Rodrigues curtiu seu post.",
            "A ordem dos tratores não altera o viaduto, mas o VAR sim.",
            "Futebol brasileiro: Um 7x1 por dia fora de campo.",
            "Aqui o crime compensa, se for a favor do meu time.",
            "Justiça tarda, mas não falha para o Flamengo.",
            "O VAR é cego quando convém.",
            "Sistema: O 12º jogador de quem paga mais.",
            "CBF: Comitê Brasileiro de Fora da Lei.",
            "Pênalti é igual a VAR: depende da camisa.",
            "O regulamento foi escrito em guardanapo de churrascaria.",
            "O Pix do Urubu caiu na conta do juiz.",
            "Rede Globo: Transmitindo a injustiça em HD.",
            "Plim-plim: O sinal do VAR vem do Rio.",
            "Urubu do Pix: Invista 1 pênalti, receba 3 pontos."
        ];

        this.varmengoSatire = [
            "O Apito Amigo Tradicional",
            "80% de chance de pênalti",
            "A mão do Wright",
            "Zico aprova esse VAR",
            "GabiGol de Pênalti",
            "O sistema é Rubro-Negro",
            "Justiça Divina da Gávea",
            "VAR-mengão em ação",
            "Pênalti por telepatia",
            "A regra 1 é: Flamengo sempre ganha",
            "Falta no Bruno Henrique? Pênalti!",
            "O Urubu do VAR está de olho",
            "Cartão vermelho pro vento contra o Fla",
            "Escanteio que vira gol de mão validado",
            "Urubu do Pix mandou um sinal",
            "Globo Esporte já confirmou o gol",
            "Ligação direta com a cabine do VAR"
        ];

        this.varmeirasSatire = [
            "O Pacto com o VAR",
            "Gramado Verde Fluorescente",
            "Sem Mundial, Com Sistema",
            "O Brabo do Allianz",
            "Sistema Anti-Gol",
            "Dancinha do Scarpa no VAR",
            "Abel Ferreira e o Grimório",
            "Pacto da Crefisa com o Apito",
            "O Sistema do Abel não falha",
            "VAR-meiras: A força do alviverde",
            "Rony Rústico e o Pênalti Místico",
            "Tia Leila comprou o VAR?",
            "Acordo de 1951 com o juiz",
            "Parmera no VAR é gol na certa",
            "O Pix da Crefisa chegou no VAR",
            "Analisando... Pix confirmado!",
            "O Pacto foi renovado na Globo"
        ];

        this.initThree();
        this.bindEvents();
        this.setupScene();
        this.animate();
        this.randomizeSatire();
        this.pendingPassTargetIdx = null;
    }

    randomizeSatire() {
        const titleText = document.getElementById('satire-text');
        const varmengoText = document.getElementById('varmengo-satire');
        const varmeirasText = document.getElementById('varmeiras-satire');

        if (titleText) titleText.innerText = this.satireTexts[Math.floor(Math.random() * this.satireTexts.length)];
        if (varmengoText) varmengoText.innerText = this.varmengoSatire[Math.floor(Math.random() * this.varmengoSatire.length)];
        if (varmeirasText) varmeirasText.innerText = this.varmeirasSatire[Math.floor(Math.random() * this.varmeirasSatire.length)];
    }

    initThree() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb); // Céu azul

        // Câmera isométrica para vibe retro
        const aspect = window.innerWidth / window.innerHeight;
        const d = 10;
        this.camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
        this.camera.position.set(20, 20, 20);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: false });
        // Efeito Pixelado: Renderiza em escala menor
        this.pixelRatio = 0.25;
        this.renderer.setSize(window.innerWidth * this.pixelRatio, window.innerHeight * this.pixelRatio, false);
        this.renderer.domElement.id = "game-canvas";
        document.getElementById('game-container').prepend(this.renderer.domElement);

        window.addEventListener('resize', () => {
            const aspect = window.innerWidth / window.innerHeight;
            this.camera.left = -d * aspect;
            this.camera.right = d * aspect;
            this.camera.top = d;
            this.camera.bottom = -d;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth * this.pixelRatio, window.innerHeight * this.pixelRatio, false);
        });

        // Luzes
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10, 20, 10);
        this.scene.add(dirLight);
    }

    setupScene() {
        // Gramado
        const gGeo = new THREE.BoxGeometry(20, 1, 40);
        const gMat = new THREE.MeshLambertMaterial({ color: 0x27ae60 });
        this.field = new THREE.Mesh(gGeo, gMat);
        this.field.position.y = -0.5;
        this.scene.add(this.field);

        // Linhas
        const lineMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const midLine = new THREE.Mesh(new THREE.BoxGeometry(20, 0.1, 0.2), lineMat);
        midLine.position.set(0, 0.01, 0);
        this.scene.add(midLine);

        // Gols
        this.createGoal(19);
        this.createGoal(-19);

        // Times e Goleiros (Serão criados em createPlayers)
        this.playerPlayers = [];
        this.enemies = [];
        this.gkEnemy = null;
        this.gkPlayer = null;
        this.createPlayers();

        // Bola Redonda (Sphere)
        const ballGeo = new THREE.SphereGeometry(0.3, 16, 16);
        const ballMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
        // Adicionar textura simples de gomos
        this.ball = new THREE.Mesh(ballGeo, ballMat);
        this.ball.position.set(0, 0.3, 0);
        this.scene.add(this.ball);
        this.ballVel = new THREE.Vector3();
        this.ballCooldown = 0; // Cooldown para evitar recaptura imediata

        // Estado de Jogo
        this.activePlayerIdx = 0;
        this.hero = this.playerPlayers[0];

        // Replay/VAR
        this.replayBuffer = [];
        this.isReplaying = false;
        this.replayFrame = 0;
    }

    createGoal(zPos) {
        const goalGroup = new THREE.Group();
        const postGeo = new THREE.BoxGeometry(0.3, 3, 0.3);
        const barGeo = new THREE.BoxGeometry(8, 0.3, 0.3);
        const material = new THREE.MeshLambertMaterial({ color: 0xffffff });

        const p1 = new THREE.Mesh(postGeo, material); p1.position.set(-4, 1.5, 0);
        const p2 = new THREE.Mesh(postGeo, material); p2.position.set(4, 1.5, 0);
        const bar = new THREE.Mesh(barGeo, material); bar.position.set(0, 3, 0);

        // Adicionar "redes" laterais para evitar gols por fora
        const sideGeo = new THREE.BoxGeometry(0.1, 3, 1.5);
        const sideMat = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
        const s1 = new THREE.Mesh(sideGeo, sideMat); s1.position.set(-4, 1.5, zPos > 0 ? 0.75 : -0.75);
        const s2 = new THREE.Mesh(sideGeo, sideMat); s2.position.set(4, 1.5, zPos > 0 ? 0.75 : -0.75);
        
        goalGroup.add(p1, p2, bar, s1, s2);
        goalGroup.position.z = zPos;
        this.scene.add(goalGroup);
    }

    createPlayers() {
        const isFla = this.team === 'VARMENGO';
        const pColor1 = isFla ? 0xd30000 : 0x006437;
        const pColor2 = isFla ? 0x000000 : 0xffffff;

        // Jogadores do Usuário (5 jogadores)
        for (let i = 0; i < 5; i++) {
            let p = this.createVoxelPlayer(pColor1, pColor2);
            p.position.set(-8 + (i * 4), 0.5, 5 + (i * 1.5));
            this.playerPlayers.push(p);
            this.scene.add(p);
        }

        // Time Adversário (5 jogadores)
        for (let i = 0; i < 5; i++) {
            let enemy = this.createVoxelPlayer(0xeeeeee, 0x3498db);
            enemy.position.set(-8 + (i * 4), 0.5, -8 - (i * 1.5));
            this.enemies.push(enemy);
            this.scene.add(enemy);
        }

        // Goleiros
        this.gkEnemy = this.createVoxelPlayer(0xf1c40f, 0x111111);
        this.gkEnemy.position.set(0, 0.5, -18.5);
        this.scene.add(this.gkEnemy);

        this.gkPlayer = this.createVoxelPlayer(0x34495e, 0x111111);
        this.gkPlayer.position.set(0, 0.5, 18.5);
        this.scene.add(this.gkPlayer);

        this.referee = this.createVoxelPlayer(0xeeeeee, 0x111111);
        this.referee.position.set(8, 0.5, 0);
        this.scene.add(this.referee);
    }

    createVoxelPlayer(color1, color2) {
        const group = new THREE.Group();
        group.userData = { 
            falling: false, 
            fallTime: 0, 
            yellowCards: 0, 
            expelled: false,
            id: Math.random(),
            waitingForKickoff: false
        };

        // Cabeça
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), new THREE.MeshLambertMaterial({ color: 0xffdbac }));
        head.position.y = 1.4;
        group.add(head);

        // Corpo (Listrado)
        const body1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.4), new THREE.MeshLambertMaterial({ color: color1 }));
        body1.position.y = 1.0;
        group.add(body1);
        const body2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.4), new THREE.MeshLambertMaterial({ color: color2 }));
        body2.position.y = 0.6;
        group.add(body2);

        // Pernas
        const leg = new THREE.BoxGeometry(0.3, 0.6, 0.3);
        const l1 = new THREE.Mesh(leg, new THREE.MeshLambertMaterial({ color: 0x111111 }));
        l1.position.set(-0.2, 0.3, 0);
        group.add(l1);
        const l2 = new THREE.Mesh(leg, new THREE.MeshLambertMaterial({ color: 0x111111 }));
        l2.position.set(0.2, 0.3, 0);
        group.add(l2);

        // Minicartão (Invisível por padrão)
        const cardGeo = new THREE.PlaneGeometry(0.2, 0.3);
        const cardMat = new THREE.MeshBasicMaterial({ color: 0xffd700, side: THREE.DoubleSide });
        const yellowCardMesh = new THREE.Mesh(cardGeo, cardMat);
        yellowCardMesh.position.set(0.4, 1.8, 0);
        yellowCardMesh.visible = false;
        yellowCardMesh.name = "yellowCardUI";
        group.add(yellowCardMesh);

        return group;
    }

    bindEvents() {
        document.getElementById('btn-varmengo').onclick = () => this.startMode('VARMENGO');
        document.getElementById('btn-varmeiras').onclick = () => this.startMode('VARMEIRAS');
        document.getElementById('btn-resume').onclick = () => this.togglePause();
        document.getElementById('btn-quit').onclick = () => location.reload();

        window.addEventListener('keydown', (e) => {
            if (e.code === 'Escape') {
                this.togglePause();
                return;
            }

            if (this.state === 'PAUSE') return;

            if (this.state === 'PLAYING') {
                if (e.code === 'Space') this.triggerVAR();
                if (e.code === 'KeyK') this.kickBall();
                if (e.code === 'KeyL') this.passBall();
            } else if (this.state === 'PENALTY' && e.code === 'Space') {
                this.shootPenalty();
            }
            this.keys[e.code] = true;
        });
        window.addEventListener('keyup', (e) => this.keys[e.code] = false);
        this.keys = {};
    }

    startMode(team) {
        this.team = team;
        this.state = 'PLAYING';

        // Limpar todos os NPCs antigos da cena para evitar duplicatas
        [...this.playerPlayers, ...this.enemies, this.referee, this.gkEnemy, this.gkPlayer].forEach(p => {
            if (p) this.scene.remove(p);
        });
        
        this.playerPlayers = [];
        this.enemies = [];
        this.gkEnemy = null;
        this.gkPlayer = null;
        this.createPlayers();
        this.hero = this.playerPlayers[0];

        const isFla = this.team === 'VARMENGO';
        const teamLabel = isFla ? 'FLA' : 'PAL';
        document.getElementById('team-name').innerText = teamLabel;
        document.getElementById('goal-msg').innerText = `GOOOOOL DO ${isFla ? 'FLAMENGO' : 'PALMEIRAS'}!`;

        document.getElementById('main-menu').classList.add('hidden');
        document.getElementById('hud').classList.remove('hidden');
        document.getElementById('controls-hint').innerHTML = "WASD: Mover | K: Chutar | L: Passar | ESPAÇO: Cavar VAR";
        this.updateHUD();
        this.ballCooldown = 0;
        this.pendingPassTargetIdx = null;
    }

    // This method should be called in the main update/animation loop
    // to handle ball domination and player switching.
    updateBallDomination() {
        if (this.ballCooldown > 0) {
            this.ballCooldown--;
        }

        // Se houver um passe em curso, verifica se o alvo pegou
        if (this.pendingPassTargetIdx !== null) {
            const targetP = this.playerPlayers[this.pendingPassTargetIdx];
            if (this.ball.position.distanceTo(targetP.position) < 1.3) {
                this.activePlayerIdx = this.pendingPassTargetIdx;
                this.hero = this.playerPlayers[this.activePlayerIdx];
                this.pendingPassTargetIdx = null;
                this.ballCooldown = 5;
                return;
            }
        }

        if (this.ballCooldown > 0) return;

        // Domínio da bola pelo herói atual
        if (!this.hero.userData.falling && this.hero.position.distanceTo(this.ball.position) < 1.2) {
            const rot = this.hero.rotation.y;
            const targetPos = new THREE.Vector3(
                this.hero.position.x - Math.sin(rot) * 0.8,
                0.3, // Altura da bola
                this.hero.position.z - Math.cos(rot) * 0.8
            );
            this.ball.position.lerp(targetPos, 0.4);
            this.ballVel.set(0, 0, 0);
            const moving = this.keys['KeyW'] || this.keys['KeyS'] || this.keys['KeyA'] || this.keys['KeyD'];
            if (moving) this.ball.rotation.x += 0.3;
            this.pendingPassTargetIdx = null;
        }
    }

    kickBall() {
        const dist = this.hero.position.distanceTo(this.ball.position);
        if (dist < 1.5) {
            const rot = this.hero.rotation.y;
            const dir = new THREE.Vector3(-Math.sin(rot), 0, -Math.cos(rot));
            this.ballVel.copy(dir.multiplyScalar(0.7));
            this.ballCooldown = 15; // 15 frames de cooldown
        }
    }

    passBall() {
        const dist = this.hero.position.distanceTo(this.ball.position);
        if (dist < 1.5) {
            let closest = null;
            let minDist = Infinity;
            this.playerPlayers.forEach((p, i) => {
                if (i === this.activePlayerIdx || p.userData.expelled) return;
                let d = this.hero.position.distanceTo(p.position);
                if (d < minDist) {
                    minDist = d;
                    closest = i;
                }
            });

            if (closest !== null) {
                const target = this.playerPlayers[closest];
                const dir = new THREE.Vector3().subVectors(target.position, this.hero.position).normalize();
                this.ballVel.copy(dir.multiplyScalar(0.55));
                this.pendingPassTargetIdx = closest;
                this.ballCooldown = 15;
            }
        }
    }

    togglePause() {
        if (this.state === 'MENU') return;
        if (this.state === 'PAUSE') {
            this.state = this.prevState || 'PLAYING';
            document.getElementById('pause-menu').classList.add('hidden');
        } else {
            this.prevState = this.state;
            this.state = 'PAUSE';
            document.getElementById('pause-menu').classList.remove('hidden');
        }
    }

    triggerSimulationVAR(player) {
         if (this.state === 'PAUSE') return;
         this.state = 'VAR';
         this.ballVel.set(0,0,0);
         
         // Drama: boneco cai
         player.userData.falling = true;

         const varMainText = document.querySelector('#var-overlay .goal-text');
         if (varMainText) varMainText.innerText = "ANÁLISE DE SIMULAÇÃO";

         setTimeout(() => {
             if (this.state === 'PAUSE') { /* logic to wait? better just simple for now */ }
             document.getElementById('var-overlay').classList.remove('hidden');
             setTimeout(() => {
                 document.getElementById('var-overlay').classList.add('hidden');
                 this.showYellowCardForSimulation(player);
             }, 3000);
         }, 800);
    }

    showYellowCardForSimulation(player) {
        const yellowText = document.querySelector('#yellowcard-overlay .goal-text');
        if (yellowText) yellowText.innerText = "SIMULAÇÃO DETECTADA";
        
        const eventPos = this.ball.position.clone();
        
        // Lógica de cartões unificada
        player.userData.yellowCards++;
        const cardMesh = player.getObjectByName("yellowCardUI");
        if (cardMesh) cardMesh.visible = true;

        if (player.userData.yellowCards >= 2) {
             // Segundo amarelo = Vermelho e Expulsão
             document.getElementById('yellowcard-overlay').classList.remove('hidden');
             setTimeout(() => {
                 document.getElementById('yellowcard-overlay').classList.add('hidden');
                 this.showRedCardFromInfraction(player, 'SIMULATION', eventPos);
             }, 2000);
        } else {
            // Apenas amarelo
            document.getElementById('yellowcard-overlay').classList.remove('hidden');
            setTimeout(() => {
                document.getElementById('yellowcard-overlay').classList.add('hidden');
                this.restartAfterEvent(eventPos);
                player.userData.falling = false;
                if (yellowText) yellowText.innerText = "JOGADOR PENDURADO";
            }, 3000);
        }
    }

    showRedCardFromInfraction(player, type, eventPos) {
        document.getElementById('redcard-overlay').classList.remove('hidden');
        setTimeout(() => {
            player.userData.expelled = true;
            player.visible = false;
            document.getElementById('redcard-overlay').classList.add('hidden');
            
            const aliveEnemies = this.enemies.filter(e => !e.userData.expelled);
            if (aliveEnemies.length <= 1) {
                this.showVictory();
            } else {
                if (type === 'PENALTY') {
                    this.setupPenalty();
                } else {
                    this.restartAfterEvent(eventPos || this.ball.position.clone());
                    player.userData.falling = false;
                }
            }
        }, 4000);
    }

    triggerVAR() {
        if (this.state !== 'PLAYING') return;
        
        // A animação de queda já foi iniciada na colisão
        // Esperamos 1.5 segundos para mostrar a tela do VAR
        setTimeout(() => {
            this.state = 'VAR';
            this.isReplaying = true;
            this.replayFrame = 0;

            // Resetar jogadores para normalidade na análise do VAR/Pênalti
            [...this.playerPlayers, ...this.enemies].forEach(p => {
                if (p.userData.expelled) return;
                p.userData.falling = false;
                p.rotation.set(0, p.rotation.y, 0);
                p.position.y = 0.5;
            });

            document.getElementById('var-overlay').classList.remove('hidden');

            const varText = document.getElementById('var-text-main');
            if (varText) varText.classList.remove('hidden');

            this.originalCamPos = this.camera.position.clone();
            this.camera.position.set(this.hero.position.x + 3, 3, this.hero.position.z + 3);
            this.camera.lookAt(this.hero.position);

            setTimeout(() => {
                this.setupPenalty();
            }, 3000); // Exibe o VAR por 3 segundos
        }, 1500); // 1.5s de queda antes do overlay
    }

    setupPenalty() {
        this.state = 'PENALTY';
        this.isReplaying = false;
        document.getElementById('var-overlay').classList.add('hidden');

        // Configura cena de pênalti (Simples e focada)
        this.camera.position.set(0, 4, -10);
        this.camera.lookAt(0, 1, -20);

        // Resetar o cobrador
        this.hero.userData.falling = false;
        this.hero.rotation.set(0, 0, 0);
        this.hero.position.set(0, 0.5, -15);
        
        this.ball.position.set(0, 0.3, -16);
        this.ballVel.set(0, 0, 0);

        this.gkEnemy.position.set(0, 0.5, -19.5);
        this.gkEnemy.rotation.set(0, 0, 0);

        // Ocultar absolutamente todos os outros
        this.playerPlayers.forEach(p => p.visible = (p === this.hero));
        this.enemies.forEach(p => p.visible = (p === this.gkEnemy));
        if (this.gkPlayer) this.gkPlayer.visible = false;
        if (this.gkEnemy) this.gkEnemy.visible = true;
        if (this.referee) this.referee.visible = false;

        document.getElementById('controls-hint').innerText = "USE A ou D PARA ESCOLHER O CANTO E ESPAÇO PARA CHUTAR";
    }

    shootPenalty() {
        let xVel = 0;
        if (this.keys['KeyA']) xVel = -0.15;
        if (this.keys['KeyD']) xVel = 0.15;
        if (xVel === 0) xVel = (Math.random() - 0.5) * 0.1;

        this.ballVel.set(xVel, 0, -0.6);

        // Probabilidade de 85% de defesa (Dificultando pro usuário)
        const chanceOfSave = 0.85;
        const willSave = Math.random() < chanceOfSave;

        // Animação de defesa - o goleiro se move conforme a bola
        setTimeout(() => {
            if (willSave) {
                // Goleiro "pula" para defender
                this.gkEnemy.position.x = xVel * 10; // Segue o chute
                this.gkEnemy.rotation.z = xVel > 0 ? -Math.PI / 4 : Math.PI / 4;
                
                this.ballVel.set(0, 0, 0);
                this.ball.position.set(this.gkEnemy.position.x, 0.2, this.gkEnemy.position.z + 0.5);

                setTimeout(() => {
                    this.showDefenseOverlay();
                }, 1000);
            } else {
                // Goleiro erra o lado
                this.gkEnemy.position.x = -xVel * 10;
                this.gkEnemy.rotation.z = xVel > 0 ? Math.PI / 4 : -Math.PI / 4;
                
                setTimeout(() => {
                    this.addGoal();
                }, 1000);
            }
        }, 300);
    }

    showDefenseOverlay() {
        document.getElementById('defense-overlay').classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('defense-overlay').classList.add('hidden');
            this.expelGoalkeeper();
        }, 2000);
    }

    addGoal() {
        this.state = 'GOAL_CELEBRATION'; // Trava o jogo
        this.ballVel.set(0, 0, 0);       // Trava a bola no lugar
        this.scorePlayer++;
        this.updateHUD();

        document.getElementById('goal-overlay').classList.remove('hidden');

        setTimeout(() => {
            document.getElementById('goal-overlay').classList.add('hidden');
            this.resetToKickoff();
        }, 4000); // 4s de comemoração
    }

    updateHUD() {
        document.getElementById('score-fla').innerText = this.scorePlayer;
        document.getElementById('score-adv').innerText = this.scoreAdv;
    }

    expelGoalkeeper() {
        document.getElementById('redcard-overlay').classList.remove('hidden');
        
        const fly = () => {
            this.gkEnemy.position.y += 0.5;
            this.gkEnemy.rotation.x += 0.3;
            if (this.gkEnemy.position.y < 25) {
                requestAnimationFrame(fly);
            } else {
                setTimeout(() => {
                    document.getElementById('redcard-overlay').classList.add('hidden');
                    this.addGoal();
                }, 500);
            }
        };
        
        setTimeout(() => {
            fly();
        }, 1500);
    }

    resetToKickoff() {
        this.state = 'PLAYING';
        this.randomizeSatire();
        this.camera.position.set(20, 20, 20);
        this.camera.lookAt(0, 0, 0);

        // Restaurar visibilidade e posições
        this.referee.visible = true;
        this.gkPlayer.visible = true;
        this.gkEnemy.visible = true;

        this.playerPlayers.forEach((p, i) => {
            if (!p.userData.expelled) {
                p.visible = true;
                p.position.set(-8 + (i * 4), 0.5, 5 + (i * 1.5));
                p.userData.falling = false;
                p.rotation.set(0, 0, 0);
            } else {
                p.visible = false;
            }
        });
        
        this.activePlayerIdx = this.playerPlayers.findIndex(p => !p.userData.expelled);
        if (this.activePlayerIdx === -1) this.showGameOver(); // Caso extremo
        else this.hero = this.playerPlayers[this.activePlayerIdx];

        this.enemies.forEach((p, i) => {
            if (!p.userData.expelled) {
                p.visible = true;
                p.position.set(-8 + (i * 4), 0.5, -8 - (i * 1.5));
                p.rotation.set(0, 0, 0);
                p.userData.falling = false;
            } else {
                p.visible = false;
            }
        });

        this.ball.position.set(0, 0.25, 0);
        this.ballVel.set(0, 0, 0);
        this.gkEnemy.position.set(0, 0.5, -18.5);
        this.gkPlayer.position.set(0, 0.5, 18.5);
        this.gkEnemy.rotation.set(0, 0, 0);
        this.gkPlayer.rotation.set(0, 0, 0);
        this.gkEnemy.position.y = 0.5;
        this.gkPlayer.position.y = 0.5;

        document.getElementById('controls-hint').innerHTML = "WASD: Mover | K: Chutar | L: Passar | ESPAÇO: Cavar VAR";
    }

    recordFrame() {
        this.replayBuffer.push({
            heroPos: this.hero.position.clone(),
            player: this.playerPlayers.map(p => ({ pos: p.position.clone(), rot: p.rotation.y, fall: p.rotation.z })),
            enemies: this.enemies.map(p => ({ pos: p.position.clone(), rot: p.rotation.y, fall: p.rotation.z })),
            ball: this.ball.position.clone(),
            gkE: this.gkEnemy.position.clone(),
            gkP: this.gkPlayer.position.clone()
        });
        if (this.replayBuffer.length > 120) this.replayBuffer.shift();
    }

    playReplay() {
        if (this.replayBuffer.length === 0) return;
        const frame = this.replayBuffer[this.replayFrame % this.replayBuffer.length];
        this.ball.position.copy(frame.ball);
        this.gkEnemy.position.copy(frame.gkE);
        this.gkPlayer.position.copy(frame.gkP);
        frame.player.forEach((fp, i) => {
            this.playerPlayers[i].position.copy(fp.pos);
            this.playerPlayers[i].rotation.y = fp.rot;
            this.playerPlayers[i].rotation.z = fp.fall;
        });
        frame.enemies.forEach((ef, i) => {
            this.enemies[i].position.copy(ef.pos);
            this.enemies[i].rotation.y = ef.rot;
            this.enemies[i].rotation.z = ef.fall;
        });
        this.replayFrame++;
    }

    update() {
        if (this.state === 'PAUSE') return;

        if (this.state === 'PLAYING') {
            const anyoneNearBall = [...this.playerPlayers, ...this.enemies].some(p => p.position.distanceTo(this.ball.position) < 1.5);
            if (anyoneNearBall) {
                this.enemies.forEach(e => e.userData.waitingForKickoff = false);
            }
            this.matchTime -= 1/60; // Assumindo 60fps
            if (this.matchTime <= 0) this.matchTime = 0;
            this.updateTimerUI();
        }

        // Animação de queda global
        [...this.playerPlayers, ...this.enemies].forEach(p => {
            if (p.userData.expelled) {
                p.position.y += 0.5;
                p.rotation.x += 0.2;
                return;
            }
            if (p.userData.falling) {
                p.rotation.z = THREE.MathUtils.lerp(p.rotation.z, Math.PI / 2, 0.1);
                p.position.y = THREE.MathUtils.lerp(p.position.y, 0.3, 0.1);
            } else {
                p.rotation.z = THREE.MathUtils.lerp(p.rotation.z, 0, 0.1);
            }
        });

        if (this.state === 'VAR' && this.isReplaying) {
            this.playReplay();
        } else if (this.state === 'PLAYING') {
            this.recordFrame();
            this.updateGameplay();
        } else if (this.state === 'PENALTY') {
            this.ball.position.add(this.ballVel);
            // Animação de defesa do goleiro durante o pênalti
            if (this.ballVel.length() > 0 && Math.abs(this.ball.position.z - this.gkEnemy.position.z) < 2) {
                this.gkEnemy.rotation.z = THREE.MathUtils.lerp(this.gkEnemy.rotation.z, xVel > 0 ? -Math.PI/4 : Math.PI/4, 0.1);
            }
            if (this.ball.position.z < -19.5) {
                this.ballVel.set(0, 0, 0);
            }
        }
    }

    updateTimerUI() {
        const mins = Math.floor(this.matchTime / 60);
        const secs = Math.floor(this.matchTime % 60);
        document.getElementById('match-timer').innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    updateGameplay() {
        const time = Date.now() * 0.005;
        const speed = 0.12;
        let moving = false;

        // Controle do Herói Ativo
        if (!this.hero.userData.falling && !this.hero.userData.expelled) {
            if (this.keys['KeyW']) { this.hero.position.z -= speed; moving = true; }
            if (this.keys['KeyS']) { this.hero.position.z += speed; moving = true; }
            if (this.keys['KeyA']) { this.hero.position.x -= speed; moving = true; }
            if (this.keys['KeyD']) { this.hero.position.x += speed; moving = true; }
        }

        if (moving) {
            this.hero.rotation.y = Math.atan2(
                (this.keys['KeyA'] ? 1 : 0) - (this.keys['KeyD'] ? 1 : 0),
                (this.keys['KeyW'] ? 1 : 0) - (this.keys['KeyS'] ? 1 : 0)
            );
            this.hero.children[0].position.y = 1.4 + Math.sin(time * 2) * 0.05;
            this.hero.position.y = 0.5 + Math.abs(Math.sin(time * 2)) * 0.1;
        } else if (!this.hero.userData.falling && !this.hero.userData.expelled) {
            this.hero.position.y = THREE.MathUtils.lerp(this.hero.position.y, 0.5, 0.1);
        }

        // Física e Condução da Bola
        this.ball.position.add(this.ballVel);
        this.ballVel.multiplyScalar(0.96);

        const distToBall = this.hero.position.distanceTo(this.ball.position);
        // Controle da bola (Dominação e Troca de jogador no passe)
        this.updateBallDomination();

        // Se algum jogador do nosso time está com a bola, toque adversário = PÊNALTI
        if (distToBall < 1.0) {
            this.enemies.forEach(e => {
                if (e.userData.expelled || e.userData.falling) return;
                // Colisão entre quem tem a bola (Hero) e inimigo
                if (this.hero.position.distanceTo(e.position) < 1.0) {
                    this.triggerBiasVARForPenalty(e);
                }
            });
        }
        
        // Colisão entre companheiros NPCs e inimigos (pode expandir se NPCs tivessem a bola)

        // IA dos Companheiros (Movimentação Autônoma para preencher o campo)
        this.playerPlayers.forEach((p, i) => {
            if (i === this.activePlayerIdx || p.userData.falling || p.userData.expelled) return;
            
            // Posições estratégicas baseadas no índice para espalhar pelo campo
            let targetX, targetZ;
            const ballX = this.ball.position.x;
            const ballZ = this.ball.position.z;

            switch(i) {
                case 0: targetX = ballX - 4; targetZ = ballZ + 2; break; // Apoio Esquerda
                case 1: targetX = ballX + 4; targetZ = ballZ + 2; break; // Apoio Direita
                case 2: targetX = ballX; targetZ = ballZ + 6; break;     // Zagueiro
                case 3: targetX = -6; targetZ = ballZ - 2; break;        // Ala Esquerda
                case 4: targetX = 6; targetZ = ballZ - 2; break;         // Ala Direita
                default: targetX = ballX; targetZ = ballZ + 3;
            }

            p.position.x = THREE.MathUtils.lerp(p.position.x, targetX, 0.03);
            p.position.z = THREE.MathUtils.lerp(p.position.z, targetZ, 0.03);
            p.lookAt(this.ball.position);
            p.rotation.x = 0; p.rotation.z = 0;
        });

        // IA Inimiga
        let enemyHoldingBall = false;
        this.enemies.forEach((p, i) => {
            if (p.userData.falling || p.userData.expelled || p.userData.waitingForKickoff) return;
            const distToBallEnemy = p.position.distanceTo(this.ball.position);

            // Conduzir a bola
            if (distToBallEnemy < 1.0 && !enemyHoldingBall) {
                enemyHoldingBall = true;
                const angleToGoal = Math.atan2(0 - p.position.x, 20 - p.position.z);
                const targetX = p.position.x + Math.sin(angleToGoal) * 1.0;
                const targetZ = p.position.z + Math.cos(angleToGoal) * 1.0;
                this.ball.position.x = targetX;
                this.ball.position.z = targetZ;
                this.ballVel.set(0,0,0);
                
                // Mover em direção ao gol do usuário
                p.position.x += Math.sin(angleToGoal) * 0.06;
                p.position.z += Math.cos(angleToGoal) * 0.06;
                p.rotation.y = angleToGoal;

                // Tentar chutar ou passar rumo ao gol
                if (p.position.z > 14) {
                    this.ballVel.set((Math.random()-0.5)*0.1, 0, 0.5);
                } else if (Math.random() < 0.05) {
                    // Inimigo resolve passar
                    const teammates = this.enemies.filter((e, idx) => idx !== i && !e.userData.expelled);
                    if (teammates.length > 0) {
                        const targetT = teammates[Math.floor(Math.random() * teammates.length)];
                        const dir = new THREE.Vector3().subVectors(targetT.position, p.position).normalize();
                        this.ballVel.copy(dir.multiplyScalar(0.4));
                    }
                }

                // Se QUALQUER jogador do nosso time encostar no inimigo COM POSSE, o inimigo "simula"
                const teammates = [this.hero, ...this.playerPlayers.filter((p, idx) => idx !== this.activePlayerIdx && !p.userData.expelled)];
                teammates.forEach(tm => {
                    if (p.position.distanceTo(tm.position) < 1.0) {
                        this.triggerSimulationVAR(p);
                    }
                });
            } else {
                // Perseguir bola de forma dispersa (Mantendo espalhamento)
                let closestDist = Infinity;
                let closestEnemy = null;
                this.enemies.forEach(e => {
                    if (e.userData.expelled || e.userData.falling) return;
                    let d = e.position.distanceTo(this.ball.position);
                    if (d < closestDist) {
                        closestDist = d;
                        closestEnemy = e;
                    }
                });

                let tx = this.ball.position.x;
                let tz = this.ball.position.z;

                if (p === closestEnemy) {
                    // Chase ball diretamente se não estiver esperando
                    if (p.userData.waitingForKickoff) return;
                } else {
                    // Posicionamento estratégico disperso baseado no índice i
                    // i=0: Marcação ala esquerda
                    // i=1: Marcação ala direita
                    // i=2: Centralizado recuado
                    // i=3: Centralizado avançado
                    // i=4: Sobra lateral
                    const offsets = [
                        {x: -6, z: -2}, {x: 6, z: -2}, 
                        {x: 0, z: -6},  {x: 2, z: 2}, 
                        {x: -4, z: 4}
                    ];
                    const off = offsets[i % offsets.length];
                    tx += off.x;
                    tz += off.y || off.z; // correção de z
                }

                const angle = Math.atan2(tx - p.position.x, tz - p.position.z);
                const moveSpeed = 0.045; // Um pouco mais devagar para evitar "vibrar"
                p.position.x += Math.sin(angle) * moveSpeed;
                p.position.z += Math.cos(angle) * moveSpeed;
                p.rotation.y = angle;
            }
        });

        // Goleiros IA + Animações de Defesa (Mais rápidos)
        this.gkEnemy.position.x = THREE.MathUtils.lerp(this.gkEnemy.position.x, this.ball.position.x, 0.12);
        this.gkEnemy.position.x = Math.max(-3.5, Math.min(3.5, this.gkEnemy.position.x));
        if (this.ball.position.z < -16 && Math.abs(this.ball.position.x - this.gkEnemy.position.x) < 2.5) {
             this.gkEnemy.rotation.z = THREE.MathUtils.lerp(this.gkEnemy.rotation.z, (this.ball.position.x > this.gkEnemy.position.x ? -1 : 1) * Math.PI/3, 0.3);
        } else {
             this.gkEnemy.rotation.z = THREE.MathUtils.lerp(this.gkEnemy.rotation.z, 0, 0.15);
        }

        this.gkPlayer.position.x = THREE.MathUtils.lerp(this.gkPlayer.position.x, this.ball.position.x, 0.1);
        this.gkPlayer.position.x = Math.max(-3.5, Math.min(3.5, this.gkPlayer.position.x));
        if (this.ball.position.z > 16 && Math.abs(this.ball.position.x - this.gkPlayer.position.x) < 2.5) {
             this.gkPlayer.rotation.z = THREE.MathUtils.lerp(this.gkPlayer.rotation.z, (this.ball.position.x > this.gkPlayer.position.x ? -1 : 1) * Math.PI/3, 0.3);
        } else {
             this.gkPlayer.rotation.z = THREE.MathUtils.lerp(this.gkPlayer.rotation.z, 0, 0.15);
        }

        // Gol do Usuário
        if (this.ball.position.z < -18.5 && Math.abs(this.ball.position.x) < 4) {
            this.addGoal();
        }
        
        // Tentativa de Gol Adversário -> Anulado pelo sistema
        if (this.ball.position.z > 18.5 && Math.abs(this.ball.position.x) < 4) {
            this.annulEnemyGoal();
        }

        // Limites do campo e chão (evitar clipping)
        const allEntities = [...this.playerPlayers, ...this.enemies, this.ball];
        allEntities.forEach(e => {
            e.position.x = Math.max(-9.5, Math.min(9.5, e.position.x));
            e.position.z = Math.max(-19.5, Math.min(19.5, e.position.z));
            if (e === this.ball) {
                e.position.y = Math.max(0.3, e.position.y);
            } else {
                e.position.y = Math.max(0.5, e.position.y);
            }
        });

        this.referee.lookAt(this.hero.position);
        this.referee.rotation.x = 0; this.referee.rotation.z = 0;

        // Hint Contextual de Cavar VAR
        let nearEnemy = false;
        this.enemies.forEach(e => {
            if (!e.userData.expelled && this.hero.position.distanceTo(e.position) < 2.5) {
                nearEnemy = true;
            }
        });
        
        const varHint = document.getElementById('var-hint');
        if (nearEnemy) {
            varHint.classList.remove('hidden');
        } else {
            varHint.classList.add('hidden');
        }
    }

    triggerBiasVARForPenalty(player) {
         if (this.state !== 'PLAYING') return;
         this.state = 'VAR';
         this.ballVel.set(0,0,0);
         
         // Atualizar texto do VAR imediatamente
         const varMainText = document.querySelector('#var-overlay .goal-text');
         if (varMainText) varMainText.innerText = `PÊNALTI PARA O ${this.team}`;

         // Animação de queda do herói também para drama
         this.hero.userData.falling = true;

         setTimeout(() => {
             document.getElementById('var-overlay').classList.remove('hidden');
             setTimeout(() => {
                 document.getElementById('var-overlay').classList.add('hidden');
                 this.applyCardForPenalty(player);
             }, 3000);
         }, 800);
    }

    applyCardForPenalty(player) {
        player.userData.yellowCards++;
        
        // Mostrar minicartão visual
        const cardMesh = player.getObjectByName("yellowCardUI");
        if (cardMesh) cardMesh.visible = true;

        if (player.userData.yellowCards >= 2) {
             this.showRedCardFromInfraction(player, 'PENALTY');
        } else {
             this.showYellowCardForPenalty(player);
        }
    }

    showYellowCardForPenalty(player) {
        document.getElementById('yellowcard-overlay').classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('yellowcard-overlay').classList.add('hidden');
            this.setupPenalty();
            player.userData.falling = false;
        }, 3000);
    }

    showRedCardForPenalty(player) {
        // Redirecionar para o método unificado
        this.showRedCardFromInfraction(player, 'PENALTY');
    }

    showVictory() {
        this.state = 'VICTORY';
        document.getElementById('victory-overlay').classList.remove('hidden');
        document.getElementById('hud').classList.add('hidden');
    }

    restartAfterEvent(eventPos) {
        this.state = 'PLAYING';
        // A bola reinicia "a frente" do acontecimento (no sentido do ataque Z-)
        this.ball.position.set(eventPos.x, 0.25, eventPos.z - 2.0);
        this.ballVel.set(0, 0, 0);

        // Afasta os inimigos na direção do gol deles (Z-) e faz eles esperarem
        this.enemies.forEach(p => {
            if (p.userData.expelled) return;
            p.userData.waitingForKickoff = true; // Só avança quando alguém tocar na bola
            // Se o inimigo estiver à frente da bola ou muito perto, empurra ele mais pra trás
            if (p.position.z > this.ball.position.z - 6) {
                p.position.z = this.ball.position.z - 8;
            }
        });
        
        // Colocamos o herói próximo da bola para o reinício
        this.hero.position.set(this.ball.position.x, 0.5, this.ball.position.z + 1.5);
    }

    annulEnemyGoal() {
        this.state = 'VAR';
        this.ballVel.set(0,0,0);
        
        const eventPos = this.ball.position.clone();

        // Pequeno delay antes de mostrar que foi anulado para criar suspense
        setTimeout(() => {
            document.getElementById('annulled-overlay').classList.remove('hidden');
            
            setTimeout(() => {
                document.getElementById('annulled-overlay').classList.add('hidden');
                // Possibilidade de expulsão do autor
                const enemiesWithBall = this.enemies.filter(e => e.position.distanceTo(this.ball.position) < 3);
                if (enemiesWithBall.length > 0 && Math.random() < 0.7) {
                     this.showRedCardForPenalty(enemiesWithBall[0]);
                } else {
                     this.restartAfterEvent(eventPos);
                }
            }, 4000); // 4s de análise de gol anulado
        }, 800);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Iniciar o jogo
window.onload = () => {
    window.game = new CBmaFiaGame();
};
